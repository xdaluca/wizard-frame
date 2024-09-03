import { Button, Frog, TextInput } from 'frog';
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';
import { handle } from 'frog/vercel';

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  title: 'ERC20 Configurator Frame',
});

app.frame('/', (c) => {
  const { buttonValue, inputText, status } = c;

  // Set default values or use input values
  const tokenName = inputText || 'MyToken';
  const tokenSymbol = inputText || 'MTK';
  const totalSupply = inputText || '1000000';

  // Collect the feature options based on button clicks
  let mintable = false;
  let burnable = false;
  let pausable = false;

  if (buttonValue === 'mintable') mintable = true;
  if (buttonValue === 'burnable') burnable = true;
  if (buttonValue === 'pausable') pausable = true;

  // If the 'submit' button is clicked, redirect with URL parameters
  if (buttonValue === 'submit') {
    const wizardUrl = new URL('https://wizard.openzeppelin.com/');
    wizardUrl.searchParams.append('tokenName', tokenName);
    wizardUrl.searchParams.append('tokenSymbol', tokenSymbol);
    wizardUrl.searchParams.append('totalSupply', totalSupply);
    if (mintable) wizardUrl.searchParams.append('mintable', 'true');
    if (burnable) wizardUrl.searchParams.append('burnable', 'true');
    if (pausable) wizardUrl.searchParams.append('pausable', 'true');

    // Redirect the user to the wizard
    return c.res({
      redirect: wizardUrl.toString(),
    });
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response'
            ? `Your ERC20 token is being configured!`
            : 'Configure Your ERC20 Token'}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Token Name" />,
      <TextInput placeholder="Token Symbol" />,
      <TextInput placeholder="Total Supply" />,
      <Button value="mintable">Mintable</Button>,
      <Button value="burnable">Burnable</Button>,
      <Button value="pausable">Pausable</Button>,
      <Button value="submit">Deploy ERC20</Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== 'undefined';
const isProduction = isEdgeFunction || import.meta.env?.MODE !== 'development';
devtools(app, isProduction ? { assetsPath: '/.frog' } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);