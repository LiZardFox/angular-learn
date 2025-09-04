import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div>
      <h1>Welcome!</h1>
      <p>Hello and welcome to our application!</p>
      
      <nav>
        <h2>Navigate to:</h2>
        <ul>
          <li><a routerLink="/todo">Todo List</a></li>
          <li><a routerLink="/slideshow">Slideshow</a></li>
          <li><a routerLink="/portals">Portals</a></li>
          <li><a routerLink="/game">Games</a></li>
        </ul>
      </nav>
    </div>
  `,
  styles: `
    h1 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    nav ul {
      list-style-type: none;
      padding: 0;
    }
    
    nav li {
      margin: 0.5rem 0;
    }
    
    nav a {
      color: #3498db;
      text-decoration: none;
      font-weight: 500;
    }
    
    nav a:hover {
      text-decoration: underline;
    }
  `
})
export default class Home {

}
