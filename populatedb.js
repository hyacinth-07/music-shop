console.log('This script populates a db of our choosing');

// to run
// node populatedb <your MongoDB url>

const userArgs = process.argv.slice(2);

const Instruments = require('./models/instruments');
const Category = require('./models/category');
const Type = require('./models/type');

const instruments = [];
const categories = [];
const types = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
	console.log('Debug: About to connect');
	await mongoose.connect(mongoDB);
	console.log('Debug: Should be connected?');
	await createCategories();
	await createTypes();
	await createInstruments();
	console.log('Debug: Closing mongoose');
	mongoose.connection.close();
}

// create instances

async function categoryCreate(index, name) {
	const category = new Category({ name: name });
	await category.save();
	categories[index] = category;
	console.log(`Added category: ${name}`);
}

async function typeCreate(index, name) {
	const type = new Type({ name: name });
	await type.save();
	types[index] = type;
	console.log(`Added type: ${name}`);
}

async function instrumentCreate(
	index,
	name,
	category,
	type,
	brand,
	description,
	price,
	inStock,
	backInStock
) {
	const inst = new Instruments({
		name: name,
		category: category,
		type: type,
		brand: brand,
		description: description,
		price: price,
		inStock: inStock,
		backInStock: backInStock,
	});

	await inst.save();
	instruments[index] = inst;
	console.log(`Added instrument: ${name}`);
}

// populate arrays

async function createCategories() {
	console.log('Adding Categories . . .');
	await Promise.all([
		categoryCreate(0, 'Guitar'),
		categoryCreate(1, 'Bass'),
		categoryCreate(2, 'Piano'),
		categoryCreate(3, 'Synthesizer'),
		categoryCreate(4, 'Controller'),
	]);
}

async function createTypes() {
	console.log('Adding Types . . .');
	await Promise.all([
		typeCreate(0, 'Electric'),
		typeCreate(1, 'Acoustic'),
		typeCreate(2, 'Digital'),
		typeCreate(3, 'Analog'),
		typeCreate(4, 'DJ'),
		typeCreate(5, 'DAW'),
		typeCreate(6, 'Classical'),
	]);
}

async function createInstruments() {
	console.log('Adding instruments . . .');
	await Promise.all([
		instrumentCreate(
			0,
			'Fender Stratocaster',
			categories[0],
			types[0],
			'Fender',
			"The iconic late '50s American design.",
			850,
			'Yes'
		),
		instrumentCreate(
			1,
			'Moog Matriarch',
			categories[3],
			types[3],
			'Moog',
			'The new semi-modular classic from the historic company.',
			1999.99,
			'No',
			'2024-04-24'
		),
		instrumentCreate(
			2,
			'Korg nanoKONTROL 2 black',
			categories[4],
			types[5],
			'Korg',
			'A portable and affordable solution.',
			60,
			'Yes'
		),
	]);
}
