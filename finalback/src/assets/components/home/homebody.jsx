import { useEffect, useState } from 'react';
import axios from 'axios';

// Components
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';
import PaginationComponent from '../pagination/pagination';

// Styles
import '../../styles/CardStyles.css';
import styles from './homebody.module.css';

function Home() {
  const [data, setdata] = useState(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const { cart } = JSON.parse(localStorage.getItem('usuario'));

  const addToCart = async (cid, pid) => {
    await axios.post(`http://localhost:8080/api/cartsBd/${cid}/product/${pid}`);
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/productsBd/?${selectedPage ? `page=${selectedPage}` : ''}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setdata(data);
      });
  }, [selectedPage]);

  return (
    <div className={styles.container}>
      <br />
      <div className={styles['products-container']}>
        {data && data.payload.map((element) => (
            <Card className="card" key={element._id}>
              <Card.Img variant="top" src={element.thumbnail} />
              <Card.Body>
                <div>
                  <Card.Title>{element.title}</Card.Title>
                  <Card.Text>{element.description}</Card.Text>
                </div>
                <div>
                  <Card.Text className="card-price">${element.price}</Card.Text>
                  <Button onClick={() => addToCart(cart, element._id)}>Agregar Producto al carrito</Button>
                </div>
              </Card.Body>
            </Card>
          ))}
      </div>
      <div className={styles.paginate}>{data && <PaginationComponent currentPage={data.page} totalPages={data.totalPages} onPageChange={(newPage) => setSelectedPage(newPage)} />}</div>
    </div>
  );
}

export default Home;


// import { useEffect, useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import axios from 'axios';
// import Card from 'react-bootstrap/Card';
// import '../../styles/CardStyles.css';
// import PaginationComponent from '../pagination/pagination';

// function Home() {
//   const [data, setdata] = useState([]);
//   useEffect(() => {
//     fetch('http://localhost:8080/api/productsBd/', {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         setdata(data.payload);
//       });
//   }, []);
//   const addToCart = async (productId) => {
//     try {
//       await axios.post('http://localhost:8080/api/cartsBd/cid/product/', {
//         productId: productId,
//       });
//       console.log('Product added to cart successfully');
//     } catch (error) {
//       console.error('Error adding product to cart:', error);
//     }
//   };
//   return (
//     <div>
//       <div className='cardContainer'>
//         {data.map((element) => (
//           <Card className="card" key={element._id}>
//             <Card.Img variant="top" src={element.thumbnail} />
//             <Card.Body className='bodyCard'>  
//               <Card.Title>{element.title}</Card.Title>
//               <Card.Text>{element.description}</Card.Text>
//               <Card.Text >$ {element.price}</Card.Text>
//               <Button variant="primary" onClick={() => addToCart(element._id)}>
//                 Agregar al carrito
//               </Button>
//             </Card.Body>
//           </Card>
//         ))}
//       </div>
//       <PaginationComponent></PaginationComponent>

//     </div>
//   );
// }

// export default Home;