import { use, useEffect, useRef, useState } from 'react';
import './App.css';
import TaskGroup from './components/TaskGroup/TaskGroup';
import { saveToStorage, loadFromStorage, removeFromStorage } from './utils/storage';

function App() {

  // tasks group will contain list of objects
  // each object has name, date, lists
  const [listOfTaskGroups, setListOfTaskGroups] = useState(() => loadFromStorage("TasksGroup"));
  
  const refAddForm = useRef(null);
  const refGroupNameInput = useRef(null);
  const refSearchInput = useRef(null);
  const refSkipStorageUpdate = useRef(false);

  const toggleAddForm=()=>{
    refAddForm.current.classList.toggle("appear");
  }
  
  const createTaskGroup = ()=>{
    if(!refGroupNameInput.current.value)
      return;
    setListOfTaskGroups([...listOfTaskGroups, {name: refGroupNameInput.current.value, date: new Date().toISOString()}])
    refGroupNameInput.current.value="";
  }

  const removeTaskGroup=(index, name, date)=>{
    removeFromStorage(`${name}, ${date}`);
    setListOfTaskGroups(listOfTaskGroups.filter((_, i)=> i !== index))
  }

  const searchBtn=()=>{
    refSkipStorageUpdate.current = true;

    if(!refSearchInput.current.value){
      setListOfTaskGroups(window.localStorage["TasksGroup"]?JSON.parse(window.localStorage["TasksGroup"]) : [])
      return;
    }

    setListOfTaskGroups(listOfTaskGroups.filter((e)=>(
      e.name.toLowerCase().includes(refSearchInput.current.value.toLowerCase())
    )))

    // Reset the skip flag **after** the effect runs
    setTimeout(() => {
      refSkipStorageUpdate.current = false;
    }, 0);
  }

  useEffect(()=>{
    if(refSkipStorageUpdate.current)
      return;

    saveToStorage("TasksGroup", listOfTaskGroups);
  }, [listOfTaskGroups])

  return (
    <div className="App">
      <>
        <header>
          <div className='container'>
            <div className='search'>
              <input ref={refSearchInput} onChange={searchBtn} placeholder='Search For Task Group...'></input>
            </div>
            <div className='add'>
              <div ref={refAddForm} className='add-Form'>
                <input ref={refGroupNameInput} placeholder='Enter Task Group Name...'></input>
                <button onClick={createTaskGroup}>Create</button>
              </div>
              <span className='addBtn' onClick={toggleAddForm}>➕</span>
            </div>
          </div>
        </header>
        <section className='taskSection'>
          <div className='container'>
            <div className='TaskGroups'>
              {listOfTaskGroups? listOfTaskGroups.map((group, index)=>(
              <div className='appTaskGroup'>
                <span onClick={()=>removeTaskGroup(index, group.name, group.date)} className='trash'>🗑️</span>
                <TaskGroup name={group.name} date={group.date} sentList={group.list}></TaskGroup>
              </div>
              )) : []}    
            </div>
          </div>  
        </section>
      </>
    </div>
  );
}

export default App;
