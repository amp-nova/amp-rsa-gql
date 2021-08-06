const _ = require('lodash')
const async = require('async')
const assert = require('assert');
const chalk = require('chalk')
const nconf = require('nconf')
const axios = require('axios')

const { fetchAllProducts } = require('./index')
const { ProductResults } = require('./types')

let backendKeys = []

// command line arguments
const graphqlHost = nconf.argv().get('graphqlHost') || `http://localhost:3002`
const graphqlUrl = `${graphqlHost}/graphql`

let run = async() => {
    console.log(`Testing against server ${chalk.bgBlueBright(graphqlUrl)}`)
    console.log()

    let bkResponse = await axios.get(`${graphqlHost}/keys`)
    backendKeys = bkResponse.data.keys
    console.log(backendKeys)

    async.eachSeries(backendKeys, async backendKey => {
        let mapped = {}
        let flattenCategories = cats => {
            _.each(cats, cat => {
                mapped[cat.id] = cat
                flattenCategories(cat.children)
            })
        }

        console.log()
        console.log(chalk.gray(backendKey))
        console.log('-'.padStart(backendKey.length, '-'))
        console.log()
    
        let productsResponse = await fetchAllProducts({ graphqlConfig: { graphqlUrl, backendKey } })
        console.log(`    products:         [ ${chalk.magenta(productsResponse.meta.total)} ]`)
    
        // let topLevelCategories = (await client.query({ query: CATEGORY_HIERARCHY_QUERY })).data.categoryHierarchy
        // flattenCategories(topLevelCategories)
    
        // let secondLevelCategories = _.flatten(_.map(topLevelCategories, 'children'))
        // let thirdLevelCategories = _.flatten(_.map(secondLevelCategories, 'children'))

        // console.log(`    categories (top): [ ${chalk.magenta(topLevelCategories.length)} ]`)
        // console.log(`               (2nd): [ ${chalk.magenta(secondLevelCategories.length)} ]`)
        // console.log(`               (3rd): [ ${chalk.magenta(thirdLevelCategories.length)} ]`)
        // console.log()
    
        // let product = _.sample(productsResponse.results)
        // let category = _.sample(Object.values(mapped))
    
        // process.stdout.write(`    lookup category [ id: ${chalk.yellow(category.id)} ]...`)
        // let categoryById = (await client.query({ query: CATEGORY_QUERY({ id: category.id }) })).data.category
        // assert.deepStrictEqual(categoryById, _.omit(category, 'children'))
        // console.log(`[ ${chalk.green('pass')} ]`)
    
        // process.stdout.write(`    lookup category [ slug: ${chalk.yellow(category.slug)} ]...`)
        // let categoryBySlug = (await client.query({ query: CATEGORY_QUERY({ slug: category.slug }) })).data.category
        // assert.deepStrictEqual(categoryBySlug, _.omit(category, 'children'))
        // console.log(`[ ${chalk.green('pass')} ]`)
    
        // process.stdout.write(`    lookup product  [ id: ${chalk.yellow(product.id)} ]...`)
        // let productById = (await client.query({ query: PRODUCT_QUERY({ id: product.id }) })).data.product
        // assert.deepStrictEqual(_.omit(productById, 'categories'), _.omit(product, 'categories'))
        // console.log(`[ ${chalk.green('pass')} ]`)
    })
}

run()