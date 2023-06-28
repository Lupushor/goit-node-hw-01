const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data); //разбирает строку JSON, возвращая объект JavaScript
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
}

async function getContactById(id) {
  const contacts = await listContacts();
  const contact = contacts.find((item) => item.id === id);
  if (!contact) {
    return null;
  }

  return contact;
}

async function removeContact(id) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  // if (index === -1) {
  //   return null;
  // }
  // const [contact] = contacts.splice(index, 1);
  const newContacts = [
    ...contacts.slice(0, index),
    ...contacts.slice(index + 1),
  ];
  await writeContacts(newContacts);
  return "Contact deleted";
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { name, email, phone, id: crypto.randomUUID() };

  contacts.push(newContact);

  await writeContacts(contacts);

  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
