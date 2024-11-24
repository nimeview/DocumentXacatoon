
import { createSignal } from "solid-js";
import styles from './back.module.scss'
export default function Home() {


  // Styles
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


  // Data 

// Login
  const [login, setLogin] = createSignal('');
  const [password, setPassword] = createSignal('');

// Register
  const [login2, setLogin2] = createSignal('');
  const [password2, setPassword2] = createSignal('');

  // Fetching Data
  function meowClick(){
    const meowka = login() + '  data  '  + password()
    alert(meowka)
  }
  function meowClick2(){
    const meowka = login2() + '  data  '  + password2()
    alert(meowka)
  }




  return (
    <main>
      <div class={styles.body}>
        <button class={styles.close}><a href="/">Close</a></button>
        { loginOrRegister() ? (
        <div class={styles.container}>
          <h1>Login</h1>
          <div class={styles.wrapper}>
            <input type="text" placeholder="Login" onInput={(e) => setLogin(e.currentTarget.value)}/> 
            <input type="text" placeholder="Password" onInput={(e) => setPassword(e.currentTarget.value)}/> 
            <button onclick={meowClick} class={styles.btn2}>Login</button>
            <button onClick={handleClick}><a href="#">Don't have an account?</a></button>
          </div>
        </div>
        ) : ( <div class={styles.container}>
          <h1>Register</h1>
          <div class={styles.wrapper}>
            <input type="text" placeholder="Login" onInput={(e) => setLogin2(e.currentTarget.value)}/> 
            <input type="text" placeholder="Password" onInput={(e) => setPassword2(e.currentTarget.value)}/> 
            <button onclick={meowClick2} class={styles.btn2}>Register</button>
            <button onClick={handleClick2}><a href="#">Already have an account?</a></button>
          </div>
        </div>)} 
      </div>      
    </main>
  );
}