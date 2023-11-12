/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* This file tests the API for retrieving meters, by artificially
 * inserting meters prior to executing the test code. */

const { chai, mocha, expect, app, testDB, testUser, recreateDB } = require('../common');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

mocha.describe('Users API', () => {
	mocha.describe('Admin role', () => {
		let token;
		mocha.before(async () => {
			// This .before happens before the one in common.js. If the DB is not in a normal
			// state at the end of previous test then the user does not exist and the token
			// is undefined. This can happen if running a single test and you kill it while running.
			// To fix this, manually call  DB creation. This will also happen right after this
			// .before finishes.
			await recreateDB();
			let res = await chai.request(app).post('/api/login')
				.send({ email: testUser.email, password: testUser.password });
			token = res.body.token;
		});
		mocha.it('retrieves users', async () => {
			const conn = testDB.getConnection();
			const password = await bcrypt.hash('password', 10);
			const csv = new User(undefined, 'csv@example.com', password, User.role.CSV);
			await csv.insert(conn);
			const res = await chai.request(app).get('/api/users').set('token', token);
			expect(res).to.have.status(200);
			expect(res.body).to.have.lengthOf(2);
		});
		mocha.it('successfully creates a user', async () => {
			// I cannot show the issue and it may be related to something else that was fixed
			// but this was failing and it is one of the only tests that had the getConnection()
			// after the the /api/ call where it used both. Just to be safe and it does not change
			// anything, the call is being put first. The concern is whether the route will use the
			// correct DB without this but it is unknown.
			// Note later testing found the issue was somewhere else but leaving this to be sure
			// and to remind me about this since it took up too much of my life.
			const conn = testDB.getConnection();
			const user = { email: 'a@ex.com', password: 'abc', role: User.role.CSV };
			const res = await chai.request(app).post('/api/users/create').set('token', token).send(user);
			expect(res).to.have.status(200);
			const dbUser = await User.getByEmail(user.email, conn);
			expect(dbUser.role).to.equal(user.role);
		});
		mocha.it('rejects invalid user creation', async () => {
			const conn = testDB.getConnection();
			const user = { email: 'a@ex.com', password: 'abc' };
			const res = await chai.request(app).post('/api/users/create').set('token', token).send(user);
			expect(res).to.have.status(400);
			const users = await User.getAll(conn);
			expect(users).to.have.lengthOf(1);
		});
		mocha.it('update role', async () => {
			const conn = testDB.getConnection();
			const password = await bcrypt.hash('password', 10);
			const csv = new User(undefined, 'csv@example.com', password, User.role.CSV);
			await csv.insert(conn);
			const obvius = new User(undefined, 'obvius@example.com', password, User.role.OBVIUS);
			await obvius.insert(conn);
			const users = await User.getAll(conn);
			expect(users).to.have.lengthOf(3);
			const res = await chai.request(app).post('/api/users/edit').set('token', token).send({
				users: [
					{ email: testUser.email, role: testUser.role },
					{ email: csv.email, role: User.role.OBVIUS },
					{ email: obvius.email, role: User.role.CSV }
				]
			});
			expect(res).to.have.status(200);
			const modifiedCsv = await User.getByEmail(csv.email, conn);
			expect(modifiedCsv.role).to.equal(User.role.OBVIUS);
			const modifiedObvius = await User.getByEmail(obvius.email, conn);
			expect(modifiedObvius.role).to.equal(User.role.CSV);
		});
		mocha.it('deletes a user', async () => {
			const conn = testDB.getConnection();
			const password = await bcrypt.hash('password', 10);
			const csv = new User(undefined, 'csv@example.com', password, User.role.CSV);
			await csv.insert(conn);
			const dbUser = await User.getByEmail(csv.email, conn);
			expect(dbUser.email).to.equal(csv.email);
			const res = await chai.request(app).post('/api/users/delete').set('token', token).send({ email: csv.email });
			expect(res).to.have.status(200);
			expect((await User.getAll(conn)).filter(user => user === csv.email)).to.have.length(0);
		});
	});

	mocha.describe('Non-Admin role:', () => {
		for (const role in User.role) {
			if (User.role[role] !== User.role.ADMIN) {
				let token;
				mocha.beforeEach(async () => {
					// insert test user
					const conn = testDB.getConnection();
					const password = 'password';
					const hashedPassword = await bcrypt.hash(password, 10);
					const unauthorizedUser = new User(undefined, `${role}@example.com`, hashedPassword, User.role[role]);
					await unauthorizedUser.insert(conn);
					unauthorizedUser.password = password;

					// login
					let res = await chai.request(app).post('/api/login')
						.send({ email: unauthorizedUser.email, password: unauthorizedUser.password });
					token = res.body.token;
				});
				mocha.it('should reject request to retrieve users', async () => {
					const res = await chai.request(app).get('/api/users').set('token', token);
					expect(res).to.have.status(403);
				});
				mocha.it(`should reject requests from ${role} to create users`, async () => {
					// create
					const res = await chai.request(app).post('/api/users/create').set('token', token);
					expect(res).to.have.status(403);
				});

				mocha.it(`should reject requests from ${role} to edit users`, async () => {
					// edit
					let res = await chai.request(app).post('/api/users/edit').set('token', token);
					expect(res).to.have.status(403);
				});

				mocha.it(`should reject requests from ${role} to delete users`, async () => {
					// delete
					const res = await chai.request(app).post('/api/users/delete').set('token', token);
					expect(res).to.have.status(403);
				});
			}
		}
	});
});