import './App.css';
import { useEffect, useState} from 'react';




function App() {
  const [numbers, setNumbers] = useState([]);
  const [number, setNumber] = useState('');
  const [target, setTarget] = useState('');
  const [message, setMessage] = useState('');
  const [operationMessage, setOPerationMessage] = useState('');
  let [searchNumStep, setSearchNumStep] = useState(0);


  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function changePropertyFromTo(arr, indexFrom, indexTo, classname){
    let localArr = arr.slice();
    let i = indexFrom;
    while(i <= indexTo ){
      localArr[i++].customClass = classname;
    }
    return localArr;
  }


 async function sortArr(arr) {

  setOPerationMessage('Sorting Array...');
    let temp1, temp2, sorted = arr.slice();
    for (let i = 0; i < arr.length; i++) {
      sorted = changePropertyFromTo(sorted,i, i, 'left_operand_node');
      setNumbers(sorted.slice());
      for (let j = i+1; j < arr.length; j++) {
        sorted = changePropertyFromTo(sorted,j, j, 'right_operand_node');
        setNumbers(sorted.slice());
        await sleep(100)
        if (Number.parseInt(sorted[i].value) > Number.parseInt(sorted[j].value)) {
          sorted = changePropertyFromTo(sorted,j, j, 'selected_node');
          setNumbers(sorted.slice());
          temp1 = sorted[i];
          temp2 = sorted[j];
          sorted[i] = temp2;
          sorted[j] = temp1;
          await sleep(300);
          sorted = changePropertyFromTo(sorted,j, j, '');
          sorted = changePropertyFromTo(sorted,i, i, 'left_operand_node');     
          setNumbers(sorted.slice());
  
        }

        sorted = changePropertyFromTo(sorted,j, j, '');
        setNumbers(sorted.slice());
      }
      for (let m = 0; m < sorted.length; m++) {
        sorted[m].index = m;
      }
      sorted = changePropertyFromTo(sorted,i, i, '');

    }
    setOPerationMessage('Sorting Array...Done!');
    return sorted.slice();
  }


  async function search(arr, target){
    let localArr = arr.slice();
    let left = 0;
    let right = localArr.length - 1;
    let mid = Math.floor((left + right) / 2);

    setOPerationMessage('Searching Target: ...');
    await sleep(500);


    while (left <= right) {
      setSearchNumStep(searchNumStep++);
      mid = Math.floor((left + right) / 2);
      localArr = changePropertyFromTo(localArr.slice(), mid, mid, 'left_operand_node');

      setOPerationMessage('Searching Target: Get the middle number.');
      setNumbers(localArr.slice());
      await sleep(2000);

      setOPerationMessage('Searching Target: Check if middle number is equal to '+ target+'.');

      if (Number.parseInt(localArr[mid].value) === target) {
        localArr = changePropertyFromTo(localArr.slice(), 0, localArr.length-1 , 'ignored_node');
        localArr = changePropertyFromTo(localArr.slice(), mid, mid, '');
        setOPerationMessage('Target found at '+ mid + ' index in just '+ searchNumStep +' step/s.');
        return localArr;
      }else{
        setOPerationMessage('Searching Target: Middle number doesn\'t match to the target.');
        localArr = changePropertyFromTo(localArr.slice(), mid, mid, 'negative_node');
      }

      setNumbers(localArr.slice());
      await sleep(2000);

      setOPerationMessage('Searching Target: Check if target is greater or less than the middle number.');
      await sleep(2000);

      if (Number.parseInt(localArr[mid].value) === target) {
        return localArr;

      } else if (arr[mid].value < target) {

        setOPerationMessage('Searching Target: Target is greater than the middle number.');
        await sleep(2000);
        setOPerationMessage('Searching Target: Search target in the right half of the array.');
        localArr = changePropertyFromTo(localArr.slice(), left, mid, 'ignored_node' );
        setNumbers(localArr.slice());
        await sleep(2000);
        left = mid + 1; // Target is in the right half

      } else {
        setOPerationMessage('Searching Target: Target is less than the middle number.');
        await sleep(2000);
        setOPerationMessage('Searching Target: Search target in the left half of the array.');
        localArr = changePropertyFromTo(localArr.slice(), mid, right, 'ignored_node' );
        setNumbers(localArr.slice());
        await sleep(2000);
        right = mid - 1; // Target is in the left half
      }
      
    }
    localArr = changePropertyFromTo(localArr.slice(), mid, mid, 'ignored_node' );
    setOPerationMessage('Target Not Found');
    await sleep(3000);
    return localArr.slice(); // Element not found
  }
  

  const clearArr = () => {
    setSearchNumStep(0);
    setNumbers([]);
  }


  const handleInsertNumber = () => {
    if (number === '') {
      setMessage('Enter Some number.');
    } else {
      setNumbers([...numbers, { index: numbers.length, value: number, customClass: ''}]);
      setNumber('');
    }
  };


  useEffect(() => {
    setMessage('');
  }, [number]);


  const start = async() => {
    setSearchNumStep(0);
    resetProp();
    if(target === ''){
      setMessage('Target Number is Empty')
    }else{
    let sortedArr = await sortArr(numbers.slice());
    setNumbers(sortedArr);
    await sleep(500);
    let newArr = await search(sortedArr, Number.parseInt(target));
    console.log(newArr);
    }
    
  };


  const resetProp = () => {
    setNumbers(changePropertyFromTo(numbers, 0, numbers.length-1, ''));
  };

  return (
    <div className="App">
      <h1 id='title'>Binary Search Algorithm</h1>
      <div className='input_div'>
        <div className='input_container'>
          <label htmlFor="node_tf">Insert Numbers:</label>
          <input type='number' id='node_tf' value={number} onChange={(e) => {setNumber(e.target.value)}}/>
          <button onClick={handleInsertNumber}>Insert</button>
        </div>
        <div className='input_container'>
          <label htmlFor="target_tf">Target Number:</label>
          <input type="text" name="" id="target_tf" value={target} onChange={(e) => {setTarget(e.target.value)}}/>
          <button className='button_style_1' onClick={start}>Start</button>
          <button onClick={resetProp} style={{margin: '0 0 0 10px'}}>Reset</button>
          <button onClick={clearArr} style={{margin: '0 0 0 10px'}}>Clear</button>
        </div>
      </div>
        <p className='message'>{message}</p>
        <div className='content'>

          <div className='display_bar'>
            { numbers &&
              numbers.map((number) => (
                <div key={number.index} id={number.index} className={'node '+number.customClass} >
                <p className='number'>{number.value}</p>
              </div>
              ))
            }
          </div>
          <p className='message'>{operationMessage}</p>

        </div>
    </div>
  );
}

export default App;