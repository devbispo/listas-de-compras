import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {addDoc, collection, getDocs, getFirestore, doc, deleteDoc} from 'firebase/firestore';
import './ListaItem.css';

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCCattFvjkvlPjutQV-W4ucFjF7u2aEcPk",
  authDomain: "construcaofrontend.firebaseapp.com",
  projectId: "construcaofrontend",
  storageBucket: "construcaofrontend.appspot.com",
  messagingSenderId: "834530171437",
  appId: "1:834530171437:web:5fc489b16596bdb03eb6a4"
});

export const ListaItem = () => {
  const [produto, setProduto] = useState("");
  const [valor, setValor] = useState("");
  const [products, setProducts] = useState([]);

  const db = getFirestore(firebaseApp);
  const userCollectionRef = collection(db, "ListaCompras");

  async function criarProduto() {
    const product = await addDoc(userCollectionRef, 
      {Produto: produto,
        Valor: parseFloat(valor)
    });
    console.log(product)
  }

  useEffect(() =>{
    const getProducts = async () => {
      const data = await getDocs(userCollectionRef);
      const productsData = data.docs.map((doc) => {
        const { Produto, Valor } = doc.data();
        return { id: doc.id, Produto, Valor: parseFloat(Valor) }; // Converter o Valor para número usando parseFloat()
      });
      setProducts(productsData);
    };

    getProducts();
  }, []);

  async function deleteProduto(id){
    const userDoc = doc(db, 'ListaCompras', id);
    await deleteDoc(userDoc)
  }
  
  return(
    <div>
    <h1>Lista compras</h1>
    <div>
      <input 
      type="text" 
      placeholder="Produto"
      value={produto}
      onChange={(e) => setProduto(e.target.value)}
      />
      <input 
      type="number" 
      placeholder="Valor"
      value={valor}
      onChange={(e) => setValor(e.target.value)}
      />
      <button onClick={criarProduto}>Adicionar lista</button>
      <ul>
        {
          products.map(user => {
            return(
              <div>
                <li>{user.Produto}</li>
                <li>{user.Valor}</li>
                <button onClick={() => deleteProduto(user.id)}>Deletar Item</button>
                <br></br>
              </div>
            )
          })
        }
      </ul>
    </div>

    </div>
  )
} 