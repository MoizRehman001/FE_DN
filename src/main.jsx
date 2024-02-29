import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import MainPage from './Pages/MainPage';
const MainPage = lazy(() => import('./Pages/MainPage'));


// using the browser router to navigate to the desired pages 
// if you want to render the child component inside parent component we can use outlet
const router = createBrowserRouter([
  {
    path: "/", //using lazy loading to do on demand loading of the component
    element: 
      <Suspense fallback={<h1>...Loading</h1>}>
        <MainPage/>  
      </Suspense>
  ,// on the root path we are rendering our main page
  
    children: [
      {
        path: "add",
        element: <h1>This is Browser Router</h1>, // this is hte nested child route
      },
    ],
  },
]);

// using the ReactDOM.createRoot we are manipulating our dom and rending our react app inside of the app container 
ReactDOM.createRoot(document.getElementById('app')).render(
  // Adding React.StrictMode for additional checks and warnings
  <React.StrictMode> 
     <RouterProvider router={router} />
  </React.StrictMode>,
)
