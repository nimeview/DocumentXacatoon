import { createSignal, onMount, createEffect, createResource } from 'solid-js';

import { Title } from "@solidjs/meta";
import './index.module.scss'


function Header(){
  
  const [loginOrRegister, setLOR] = createSignal(true);
  function handleClick() {
    setLOR((loginOrRegister) => loginOrRegister = false)
    setLogin('')
    setPassword('')
  }
  function handleClick2() {
    setLOR((loginOrRegister) => loginOrRegister = true)
    setLogin2('')
    setPassword2('')
  }

// Login
  const [login, setLogin] = createSignal('');
  const [password, setPassword] = createSignal('');

// Register
  const [login2, setLogin2] = createSignal('');
  const [password2, setPassword2] = createSignal('');

return(
   <main>
  <Title>Login</Title>
  <div class="body">
    { loginOrRegister() ? (
    <div class="container">
      <h1>Login</h1>
      <div class="wrapper">
        <input type="text" placeholder="Login" onInput={(e) => setLogin(e.currentTarget.value)}/> 
        <input type="text" placeholder="Password" onInput={(e) => setPassword(e.currentTarget.value)}/> 
        <button onclick={meowClick} class="btn2">Login</button>
        <button onClick={handleClick}><a href="#">Don't have an account?</a></button>
      </div>
    </div>
    ) : ( <div class="container">
      <h1>Register</h1>
      <div class="wrapper">
        <input type="text" placeholder="Login" onInput={(e) => setLogin2(e.currentTarget.value)}/> 
        <input type="text" placeholder="Password" onInput={(e) => setPassword2(e.currentTarget.value)}/> 
        <button onclick={meowClick2} class="btn2">Register</button>
        <button onClick={handleClick2}><a href="#">Already have an account?</a></button>
      </div>
    </div>)} 
  </div>      
</main>
  )
  }
export default Header;