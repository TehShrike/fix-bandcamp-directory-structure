const pify = require(`pify`)
const fs = pify(require(`fs`))
const { join: joinPath } = require(`path`)
const move = require(`move-file`)

const separator = ` - `

const main = async directory => {
	const allPathsInDirectory = await fs.readdir(directory)

	const stats = await Promise.all(
		allPathsInDirectory.map(async path => ({
			path,
			stat: await fs.stat(joinPath(directory, path)),
		})),
	)

	const directories = stats
		.filter(({ stat }) => stat.isDirectory())
		.map(({ path }) => path)

	await Promise.all(
		directories.map(albumDirectory => moveDirectory(directory, albumDirectory)),
	)
}

const moveDirectory = async(root, albumDirectory) => {
	const [ artist, ...albumNameParts ] = albumDirectory.split(separator)
	const albumName = albumNameParts.join(separator)

	const source = joinPath(root, albumDirectory)
	const destination = joinPath(root, artist, albumName)

	console.log(`moving`, source, `to`, destination)
	await move(source, destination)
}



const directory = `/Users/josh/New music/`

main(directory).catch(err => {
	process.nextTick(() => {
		throw err
	})
})
