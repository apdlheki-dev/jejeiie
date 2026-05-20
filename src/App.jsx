import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [people, setPeople] = useState([]);
  const [newPerson, setNewPerson] = useState({name:'', info:'', group:''});

  useEffect(()=>{
    const saved = localStorage.getItem('people-data');
    if(saved) setPeople(JSON.parse(saved));
  }, []);

  useEffect(()=>{
    localStorage.setItem('people-data', JSON.stringify(people));
  }, [people]);

  const handleLogin = (username, password) => {
    if(username==='admin' && password==='123456') setLoggedIn(true);
    else alert('اسم المستخدم أو كلمة المرور خاطئة');
  };

  const handleAddPerson = ()=>{
    if(newPerson.name){
      setPeople([...people, newPerson]);
      setNewPerson({name:'', info:'', group:''});
    }
  };

  const handleDelete = (index)=>{
    const arr = [...people];
    arr.splice(index,1);
    setPeople(arr);
  };

  const generatePDF = (person)=>{
    const doc = new jsPDF();
    doc.setFont('Arial');
    doc.text(`الاسم: ${person.name}`,10,20);
    doc.text(`المعلومات: ${person.info}`,10,30);
    doc.text(`المجموعة: ${person.group}`,10,40);
    doc.save(`${person.name}.pdf`);
  };

  if(!loggedIn){
    return (
      <div className="login-container">
        <h1>Arabic People Platform</h1>
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2>لوحة التحكم</h2>
      <div className="add-person">
        <input placeholder="الاسم" value={newPerson.name} onChange={(e)=>setNewPerson({...newPerson,name:e.target.value})} />
        <input placeholder="المعلومات" value={newPerson.info} onChange={(e)=>setNewPerson({...newPerson,info:e.target.value})} />
        <input placeholder="المجموعة" value={newPerson.group} onChange={(e)=>setNewPerson({...newPerson,group:e.target.value})} />
        <button onClick={handleAddPerson}>إضافة</button>
      </div>
      <table>
        <thead>
          <tr><th>الاسم</th><th>المعلومات</th><th>المجموعة</th><th>خيارات</th></tr>
        </thead>
        <tbody>
          {people.map((p,i)=>(
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.info}</td>
              <td>{p.group}</td>
              <td>
                <button onClick={()=>generatePDF(p)}>تحميل PDF</button>
                <button onClick={()=>handleDelete(i)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoginForm({onLogin}){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  return (
    <div>
      <input placeholder="اسم المستخدم" value={username} onChange={(e)=>setUsername(e.target.value)} />
      <input type="password" placeholder="كلمة المرور" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={()=>onLogin(username,password)}>تسجيل دخول</button>
    </div>
  );
}

export default App;