// import { useContext } from "react";
// import { AppContext } from "../pages/_app";

// export default function Slideup() {
//     const [state, dispatch] = useContext(AppContext);
//     const {visible, child} = state.modal;
//     return <div 
//         className={`fixed pointer-events-none top-0 left-0 h-screen w-screen bg-gray-700 z-40 transition-all ${visible ? "bg-opacity-60 pointer-events-auto" : "bg-opacity-0"}`}
//         onClick={() => dispatch({type: "switch-visibility"})}
//         >
//         <div 
//             className="absolute bottom-0 left-0 w-full z-50 rounded-t-xl flex flex-col bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 transition-all" 
//             style={{minHeight: '40vh', transform: `translateY(${visible ? '0' : '100vh'})`}}
//         >
//             <svg height="10" width="45%" className="self-center mt-2 mb-4" onClick={() => dispatch({type: "switch-visibility"})}>
//                 <line x1="0" y1="5" y2={5} x2="100%" stroke="grey" strokeWidth={4}></line>
//             </svg>
//             {child}
//         </div>
//     </div>;
// }
