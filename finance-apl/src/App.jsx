import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Shield, Menu, Plus, Trash2, Database } from 'lucide-react';

const firebaseConfig = {
  const firebaseConfig = {
  apiKey: "AIzaSyC...", // ganti dengan yang ada di gambar
  authDomain: "finance-apl.firebaseapp.com",
  projectId: "finance-apl",
  storageBucket: "finance-apl.appspot.com",
  messagingSenderId: "771015820888",
  appId: "1:771015820888:web:c8fe..."
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState('');

  // Sinkronisasi data real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "transaksi"), (snapshot) => {
      setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (!newItem) return;
    await addDoc(collection(db, "transaksi"), { text: newItem, created: new Date() });
    setNewItem('');
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "transaksi", id));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-6">
          <Database className="text-green-500" /> Chemistry Finance (Cloud)
        </h1>

        <div className="flex gap-2 mb-6">
          <input 
            value={newItem} 
            onChange={(e) => setNewItem(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
            placeholder="Tambah data transaksi..."
          />
          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={20} /> Simpan
          </button>
        </div>

        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
              <span>{item.text}</span>
              <button onClick={() => handleDelete(item.id)} className="text-red-500"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}