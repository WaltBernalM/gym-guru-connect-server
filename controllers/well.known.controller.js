"use strict"

const getWellKnownJson = async (req, res, next) => {
  const didDocument = {
    id: process.env.DID_DOCUMENT_ID,
    "@context": [
      "https://www.w3.org/ns/did/v1",
      {
        "@base": `did:web:${process.env.DID_DOCUMENT_URL}`,
      },
    ],
    service: [
      {
        id: "#linkeddomains",
        type: "LinkedDomains",
        serviceEndpoint: {
          origins: [`https://${process.env.DID_DOCUMENT_URL}/`],
        },
      },
      {
        id: "#hub",
        type: "IdentityHub",
        serviceEndpoint: {
          instances: [process.env.DID_DOCUMENT_INSTANCES],
        },
      },
    ],
    verificationMethod: [
      {
        id: process.env.DID_DOCUMENT_VERIF_METHOD_ID,
        controller: `did:web:${process.env.DID_DOCUMENT_URL}`,
        type: process.env.DID_DOCUMENT_VERIF_METHOD_TYPE,
        publicKeyJwk: {
          crv: process.env.DID_DOCUMENT_PUBLIC_KEY_CRV,
          kty: "EC",
          x: process.env.DID_DOCUMENT_PUBLIC_KEY_X,
          y: process.env.DID_DOCUMENT_PUBLIC_KEY_Y,
        },
      },
    ],
    authentication: [process.env.DID_DOCUMENT_AUTHENTICATION],
    assertionMethod: [process.env.DID_DOCUMENT_ASSERTION_METHOD],
  }

  res.status(200).json(didDocument)
}

module.exports = { getWellKnownJson }