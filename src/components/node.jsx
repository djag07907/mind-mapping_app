import { useState, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
} from "reactflow";
import { saveMindMap, loadMindMap } from "../storage";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Mind Map" },
    position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    style: {
      background: "#f0f8ff",
      color: "#333",
      border: "1px solid #999",
      borderRadius: "4px",
      padding: "10px",
    },
  },
];
const initialEdges = [];
const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView();
};

export default function MindNode() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [name, setName] = useState("");

  const addNode = () => {
    setNodes((prevNodes) => {
      const newNode = {
        id: (prevNodes.length + 1).toString(),
        data: { label: name },
        position: {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        },
        style: { border: "10px solid #9999" },
      };
      return [...prevNodes, newNode];
    });
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleSaveClick = () => {
    saveMindMap(nodes, edges);
    console.log(nodes);
  };
  const handleLoadClick = () => {
    const loadedData = loadMindMap();
    if (loadedData) {
      setNodes(loadedData.nodes);
      setEdges(loadedData.edges);
      console.log(loadedData);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };
  // const nodeOrigin = [0.5, 0.5];
  const connectionLineStyle = {
    stroke: "#9999",
    strokeWidth: 3,
  };
  const defaultEdgeOptions = { style: connectionLineStyle, type: "mindmap" };

  return (
    <div id="container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineStyle={connectionLineStyle}
        defaultEdgeOptions={defaultEdgeOptions}
        onConnect={onConnect}
        onLoad={onLoad}
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
        <MiniMap
          nodeColor={(n) => {
            if (n.type === "input") return "blue";

            return "#FFCC00";
          }}
        />
      </ReactFlow>
      <div>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          name="title"
        />
        <button type="button" onClick={addNode}>
          Add Node
        </button>
      </div>
      <div>
        <button id="two" onClick={handleSaveClick}>
          Save Mind Map
        </button>
        <button id="three" onClick={handleLoadClick}>
          Load Mind Map
        </button>
        <button id="four" onClick={refreshPage}>
          Refresh
        </button>
      </div>
    </div>
  );
}
