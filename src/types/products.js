/**
 * @typedef {Object} PartRequest
 * @property {string} [id]
 * @property {string} name
 * @property {number} code
 * @property {string} [description]
 * @property {string[]} moldIds
 */

/**
 * @typedef {Object} ProductRequest
 * @property {string} name
 * @property {number} code
 * @property {string} [description]
 * @property {PartRequest[]} parts
 */

/**
 * @typedef {Object} PartResponse
 * @property {string} id
 * @property {string} name
 * @property {number} code
 * @property {string} description
 * @property {string[]} moldIds
 */

/**
 * @typedef {Object} ProductResponse
 * @property {string} id
 * @property {string} name
 * @property {number} code
 * @property {string} description
 * @property {string} creator
 * @property {string} updater
 * @property {string} created
 * @property {string} [updated]
 * @property {PartResponse[]} parts
 */

/**
 * @typedef {Object} ProductSearchRequest
 * @property {string} [id]
 * @property {string} [name]
 * @property {number} [code]
 * @property {string} [partName]
 * @property {number} [partCode]
 */

/**
 * @typedef {Object} PartForm
 * @property {string} [id]
 * @property {string} name
 * @property {string|number} code
 * @property {string} description
 * @property {string[]} moldIds
 */

/**
 * @typedef {Object} ProductForm
 * @property {string} name
 * @property {string|number} code
 * @property {string} description
 * @property {PartForm[]} parts
 */

export function emptyPartForm() {
  return {
    id: undefined,
    name: '',
    code: '',
    description: '',
    moldIds: [],
  }
}

export function emptyProductForm() {
  return {
    name: '',
    code: '',
    description: '',
    parts: [emptyPartForm()],
  }
}
