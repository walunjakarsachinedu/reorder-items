import './App.css';
import { ItemList } from "./components/ItemList";
import PersonTxs from './PersonTxs';
import { registerPlugins } from './plugin-registration';


registerPlugins();


function App() {
  return <ItemList></ItemList>
  // return <PersonTxs></PersonTxs>;
}

export default App;
