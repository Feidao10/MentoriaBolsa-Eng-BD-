import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { FeedBolsas } from './pages/feedBolsas';
import { Login } from './pages/login';
import { PainelCandidato } from './pages/painelCandidato';
import { PainelMentor } from './pages/painelMentor';

import { RotaProtegida } from './components/RotaProtegida';

const PainelAdmin = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">
      Painel do Administrador
    </h1>
  </div>
);

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<FeedBolsas />}
        />

        <Route
          path="/autenticacao"
          element={<Login />}
        />

        {/* Painel do candidato */}
        <Route
          path="/candidato/dashboard"
          element={
            <RotaProtegida tipoPermitido="candidato">
              <PainelCandidato />
            </RotaProtegida>
          }
        />

        {/* Painel do mentor */}
        <Route
          path="/mentor/dashboard"
          element={
            <RotaProtegida tipoPermitido="mentor">
              <PainelMentor />
            </RotaProtegida>
          }
        />

        {/* Painel do administrador */}
        <Route
          path="/admin/dashboard"
          element={
            <RotaProtegida tipoPermitido="administrador">
              <PainelAdmin />
            </RotaProtegida>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;