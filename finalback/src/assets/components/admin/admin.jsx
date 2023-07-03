
const CurrentUser = () => {
 
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  return (
    <div className='container'>
      <div className='container'>
        <p>
          <span className='user-summary-title'>Nombre:</span> {usuario.first_name}
        </p>
        <p>
          <span className='user-summary-title'>Apellido:</span> {usuario.last_name}
        </p>
        <p>
          <span className='user-summary-title'>Edad:</span> {usuario.age}
        </p>
        <p>
          <span className='user-summary-title'>Email:</span> {usuario.email}
        </p>
        <p>
          <span className='user-summary-title'>Role:</span> {usuario.role}
        </p>
      </div>
    </div>
  );
};

export default CurrentUser; 

