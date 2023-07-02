import React from "react";
import {Button} from "react-bootstrap";
import {capitalize} from "../utils/capitalize";

// Styles
import './card.module.css';

const UserCard = ({user, onDelete, onSwitchRole}) => {
  return (
    <div className='container'>
      <div className='container'>
        <p>
          <span className='user-summary-title'>Nombre:</span> {user.first_name}
        </p>
        <p>
          <span className='user-summary-title'>Apellido:</span> {user.last_name}
        </p>
        <p>
          <span className='user-summary-title'>Email:</span> {user.email}
        </p>
        <p>
          <span className='user-summary-title'>Role:</span> {capitalize(user.role)}
        </p>
      </div>
      <div className="actions">
        <Button 
          onClick={() => onSwitchRole(user.role === "user" ? "premium" : "user")} 
          variant="warning"
        >
          Cambiar a {user.role === "user" ? "Premium" : "User"}
        </Button>
        <Button 
          onClick={onDelete} 
          variant="danger"
        >
          Borrar usuario
        </Button>
      </div>
    </div>
  );
};

export default UserCard; 