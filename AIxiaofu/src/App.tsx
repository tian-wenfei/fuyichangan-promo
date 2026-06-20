import { ChatPanel } from './components/ChatPanel';

function App() {
  return (
    <div className="app-container">
      {/* Header */}
      <div className="app-header">
        <div className="app-logo">
          <span className="text-3xl">🍃</span>
        </div>
        <h1 className="app-title">茯忆长安</h1>
        <p className="app-subtitle">科技赋能农业 · 联农带农助力乡村振兴</p>
      </div>

      {/* Chat Panel */}
      <ChatPanel />

      {/* Footer */}
      <div className="app-footer">
        <p>有任何问题？AI小茯随时为您解答~</p>
      </div>
    </div>
  );
}

export default App;
