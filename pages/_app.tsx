import React from 'react';
import '../styles/globals.css'
import Head from 'next/head';

function App({ Component, pageProps }) {
    return (
    <>
        <Head>
            <meta charSet="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>School</title>
        </Head>
        <Component {...pageProps} />
    </>
    );
}

export default App