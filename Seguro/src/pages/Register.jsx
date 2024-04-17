import React,{useState} from "react";

export default function Register() {

    const [inputVisible, setInputVisible] = useState(false);

    const toggleInputVisibility = () => {
      setInputVisible(!inputVisible);
    };


    return (
        <div>
      <h1>Register</h1>
      <button onClick={toggleInputVisibility}>Mostrar Input</button>
      {inputVisible && <input type="text" />}
    </div>
    )
}