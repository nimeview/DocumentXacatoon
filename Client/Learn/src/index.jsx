import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";

import "./SbrosStyle.css";
import Users from "./pages/User";
import Pics from "./pages/Pics";
import "./index.css";
import Rentgen from "./pages/rentgeni";
import MRT from "./pages/mrt";
import { createSignal, onMount, createEffect } from 'solid-js';


  const [isOpen, setIsOpen] = createSignal(false);
  const options = [
    { label: 'МРТ', href: '/mrt' },
    { label: 'Рентгены', href: '/rentgeni' },
    // ... можно добавить другие опции
  ];
  const [selectedValue, setSelectedValue] = createSignal(null);

  const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown')) {
      setIsOpen(false);
    }
  };

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });

const App = (props) => (
  
  <>
    <div className="containerr">
      <div className="main-content">
        <div className="backc">
          <div className="Menu">
            <div className="text3d-wrap-1">
              <span className="text3d-1"><a href="/">Home</a></span>
              <span className="text3d-1"><a href="/users">User agent</a></span>
            </div>
          </div>
        </div>
        <div className="sidebar">
          <div class="dropdown">
            <button class="dropdown-button" onClick={() => setIsOpen(!isOpen())}>
              Доступные вам папки: {selectedValue() ? selectedValue().label : 'Выберите папку'}
            </button>
            <ul class={`dropdown-menu ${isOpen() ? 'open' : ''}`}>
              {options.map((option) => (
                <a href={option.href} key={option.label} class="dropdown-link" >
                  <li onClick={() => setIsOpen(false)} >{option.label}</li>
                </a>
              ))}
            </ul>
          </div>
        </div>
        {props.children}
      </div>
    </div>  
    <footer className="footer">
      <p>© 2024 Ваш сайт. Все права защищены.</p>
    </footer>
  </>
);

const root = document.getElementById("root")
render(
  () => (
    <Router root={App}>
      <Route path="/users" component={Users} />
      <Route path="/" component={Pics} />
      <Route path="/rentgeni" component={Rentgen} />
      <Route path="/mrt" component={MRT} />
      
    </Router>
  ),
  root
);