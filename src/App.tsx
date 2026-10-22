// Ficheiro: src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FeedBolsas } from './pages/feedBolsas';
import { Login } from './pages/login';
import { PainelCandidato } from './pages/painelCandidato';
import { PainelMentor } from './pages/painelMentor'; // Importar a página real

const PainelAdmin = () => <div className="p-8"><h1 className="text-2xl font-bold">Painel do Administrador</h1></div>;

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FeedBolsas />} />
        <Route path="/autenticacao" element={<Login />} />
        <Route path="/candidato/dashboard" element={<PainelCandidato />} />
        <Route path="/mentor/dashboard" element={<PainelMentor />} /> {/* Rota atualizada */}
        <Route path="/admin/dashboard" element={<PainelAdmin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
