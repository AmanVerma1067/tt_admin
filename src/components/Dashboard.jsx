import React, { useEffect, useState } from 'react';
import { fetchTimetable, updateTimetable } from '../api';

export default function Dashboard({ token, onLogout }) {
  const [data, setData] = useState([]);
  const [edited, setEdited] = useState({}); // { batch: { Monday: [...], ... } }

  useEffect(() => {
    fetchTimetable(token).then(setData);
  }, [token]);

  const handleField = (batch, day, idx, field, value) => {
    setEdited(prev => ({
      ...prev,
      [batch]: {
        ...prev[batch],
        [day]: prev[batch]?.[day].map((item,i)=>
          i===idx ? {...item, [field]: value} : item
        )
      }
    }));
  };

  const save = async (batch) => {
    const updated = edited[batch] || data.find(d=>d.batch===batch);
    await updateTimetable(token, [{ batch, ...updated }]);
    setEdited(prev => {
      const { [batch]:_, ...rest } = prev;
      return rest;
    });
    setData(d=>d.map(item=>item.batch===batch ? { batch, ...updated } : item));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Timetable Admin</h1>
        <button onClick={onLogout} className="text-red-500">Logout</button>
      </div>
      {data.map(batchObj => (
        <div key={batchObj.batch} className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">{batchObj.batch}</h2>
          {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(day=>(
            <div key={day} className="mb-3">
              <h3 className="font-medium">{day}</h3>
              <div>
                { (edited[batchObj.batch]?.[day] || batchObj[day]).map((sess,i)=>(
                  <div key={i} className="flex space-x-2 mb-1">
                    {['time','subject','room','teacher'].map(field=>(
                      <input
                        key={field}
                        value={(edited[batchObj.batch]?.[day]||batchObj[day])[i][field]}
                        onChange={e=>handleField(batchObj.batch, day, i, field, e.target.value)}
                        className="border p-1 flex-1 rounded"
                      />
                    ))}
                  </div>
                )) }
              </div>
            </div>
          ))}
          <button 
            onClick={()=>save(batchObj.batch)}
            className="mt-2 bg-green-600 text-white py-1 px-3 rounded"
          >
            Save {batchObj.batch}
          </button>
        </div>
      ))}
    </div>
  );
}
 