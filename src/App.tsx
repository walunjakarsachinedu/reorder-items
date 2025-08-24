import './App.css';
import { dragNDropPlugin } from 'drag-and-drop-plugin';

dragNDropPlugin.enablePlugin();

function Item(props: { id: number }) {
  return (
    <div key={props.id} className="item" data-swd-targets="item" data-swd-zones="item">
      Item {props.id}
    </div>
  );
}

function List() {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const itemList = items.map((id) => {
    return Item({ id });
  });
  return <div className="flex-row-wrap">{itemList}</div>
}

function App() {
  return List();
}

export default App;
