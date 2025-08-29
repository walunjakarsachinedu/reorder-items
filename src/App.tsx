import './App.css';
import { ItemList } from "./components/ItemList";
import { registerPlugins } from './plugin-registration';


registerPlugins();


function App() {
  return <ItemList></ItemList>;
}

export default App;
