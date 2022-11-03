import { PreferencesContextComponent } from '../components/PreferencesContext'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <PreferencesContextComponent>
    <Component {...pageProps} />
  </PreferencesContextComponent>
}

export default MyApp
