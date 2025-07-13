import { useEffect, useRef, useState } from 'react';
import './TaskGroup.css';
import { saveToStorage, loadFromStorage } from '../../utils/storage';


function TaskGroup({name, date}){

    const [list, setList] = useState(() => loadFromStorage(`${name}, ${date}`));

    const refInput = useRef(null);

    const addToDo = () => {
        if(!refInput.current || !refInput.current.value) 
            return;
        
        setList([...list, {text: refInput.current.value, done: false}]);
        refInput.current.value = "";
        refInput.current.focus();
    }

    const taskClick = (index)=>{
        const newList = [...list];
        newList[index].done = !newList[index].done;
        setList([...newList])
    }

    const deleteTask = (index)=>{
        setList(list.filter((_, i)=> i !== index))
    }

    useEffect(()=>{
        saveToStorage(`${name}, ${date}`, list);
    }, [list])

    return(
    <div className='TaskGroup'>
        <h1>{name}</h1>
        <ul>
        {list ? list.map((item, index) => (
            <div className='item' key={index}>
            <li className={item.done?'done':''} onClick={()=> taskClick(index)}>
                {item.text}        
            </li>
            <span onClick={()=>deleteTask(index)}>❌</span>
            </div>
        )) : []}
        </ul>
        <div className='form'>
            <input ref={refInput} type="text" placeholder="Add a new to do"></input>
            <button onClick={addToDo}>Add</button>
        </div>
    </div>
    );
}

export default TaskGroup;