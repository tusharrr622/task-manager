import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import '../stylesheets/Navbar.css';
import Navbar from './Navbar';
import '../stylesheets/Tasks.css';

const Tasks = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [topic, setTopic] = useState("");
  const [lists, setLists] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [newContent, setNewContent] = useState("");
  const [newTopic, setNewTopic] = useState("");


  function logout(ev) {
    ev.preventDefault();
    axios.post('http://localhost:5000/logout').then(
      setUserInfo(null)
    )
  }


  function handleSubmit(ev) {
    ev.preventDefault();

    const data = {
      topic: topic,
      userId: userInfo.id
    };

    axios.post('http://localhost:5000/generatelist', data)
      .then(() => {
        return axios.get(`http://localhost:5000/lists/${userInfo.id}`);
      })
      .then(response => {
        setLists(response.data.taskDoc || []);
        setTopic("");
      })
      .catch(err => {
        console.error("Error creating or fetching tasks:", err);
      });
  }



  function handleDelete(id) {
    axios.delete(`http://localhost:5000/list/${id}`).then(() => {
      setLists(prev => prev.filter(task => task._id !== id));
    });
  }

  function handleEdit(task) {
    setEditTask(task);
    setNewTopic(task.topic);
    setNewContent(task.content);
  }


  function handleUpdate() {
    axios.put(`http://localhost:5000/list/${editTask._id}`, {
      topic: newTopic,
      content: newContent
    }).then(res => {
      const updated = res.data.updatedTask;
      setLists(prev =>
        prev.map(task => task._id === updated._id ? updated : task)
      );
      setEditTask(null);
      setNewTopic("");
      setNewContent("");
    });
  }

  function handleToggleStatus(id) {
    axios.put(`http://localhost:5000/list/status/${id}`)
      .then(res => {
        const updated = res.data.updatedTask;
        setLists(prev =>
          prev.map(task => task._id === updated._id ? updated : task)
        );
      })
      .catch(err => console.error("Status toggle error:", err));
  }



  useEffect(() => {
    if (!userInfo?.id) return;

    axios.get(`http://localhost:5000/lists/${userInfo.id}`)
      .then(Response => {
        console.log("Fetched data from backend:", Response.data);
        setLists(Response.data.taskDoc || []);
      })
      .catch(err => console.error("Error fetching tasks:", err));
  }, [userInfo?.id]);

  // 1. Still loading
  if (userInfo === null) {
    return <Navigate to="/login" />;
  }

  // 2. Not logged in
  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  // 3. Logged in
  return (
    <>
      <Navbar logout={logout} />
      <div>
        <form className='container' onSubmit={handleSubmit}>
          <input type='text' placeholder='Enter Topic' value={topic} onChange={ev => setTopic(ev.target.value)} />
          <button type='submit'>Generate</button>
        </form>


        {lists.length > 0 ? (
          lists.map((taskDoc, index) => (
            <div key={index} className='list-container'>
              <h3>
                {taskDoc.topic}
                <span style={{ color: taskDoc.status === 'complete' ? 'green' : 'red' }}>
                  {taskDoc.status || 'incomplete'}
                </span>
              </h3>
              <ul>
                {taskDoc.content?.split('\n').map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>

              <button onClick={() => handleToggleStatus(taskDoc._id)} className='toggle-btn' style={{ background: taskDoc.status === 'complete' ? 'red' : '#1570EF' }}>
                Mark as {taskDoc.status === 'complete' ? 'Incomplete' : 'Complete'}
              </button>

              <button onClick={() => handleEdit(taskDoc)} className='edit-btn'>Edit</button>
              <button onClick={() => handleDelete(taskDoc._id)} className='delete-btn'>Delete</button>
            </div>
          ))
        ) : (
          <p className='no-task'>No tasks found. Generate a list to begin.</p>
        )}


        {editTask && (
          <div className='edit-task-container'>
            <h3>Edit Task</h3>
            <input
              type="text"
              value={newTopic}
              onChange={e => setNewTopic(e.target.value)}
              placeholder="New topic"
              className='new-topic'
            />
            <textarea
              rows={5}
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="New content"
              className='new-content'
            />
            <br />
            <div className='btn-container'>
              <button className='save' onClick={handleUpdate}>Save</button>
              <button className='cancel' onClick={() => setEditTask(null)}>Cancel</button>
            </div>
          </div>
        )}

      </div>
    </>
  )

};

export default Tasks;
