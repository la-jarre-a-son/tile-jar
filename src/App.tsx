import { ThemeProvider } from '@la-jarre-a-son/ui';

import './App.scss';
import Layout from './views/Layout';
import PresetListProvider from './contexts/PresetListContext';
import PresetProvider from './contexts/PresetContext';
import RenderingProvider from './contexts/RenderingContext';

function App() {
  return (
    <ThemeProvider theme="jar" variant="dark">
      <PresetListProvider>
        <PresetProvider>
          <RenderingProvider>
            <Layout />
          </RenderingProvider>
        </PresetProvider>
      </PresetListProvider>
    </ThemeProvider>
  );
}

export default App;
