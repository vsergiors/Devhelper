const { 
  Client, 
  GatewayIntentBits, 
  Partials,
  REST, 
  Routes, 
  SlashCommandBuilder,
  ChannelType
} = require("discord.js");
const express = require("express");
const app = express();

// ====== Variables de entorno ======
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const PORT = process.env.PORT || 10000;

// ====== Datos offline ======
const answers = {
  "como crear variable en js": "Usa `let nombre = valor;` o `const nombre = valor;`",
  "como hacer un loop": "Usa `for`, `while` o `for...of` según el caso"
};

const snippets = {
  "js loop": "for(let i=0; i<5; i++){ console.log(i); }",
  "py func": "def mi_funcion():\n    print('Hola Mundo')"
};

const challenges = [
  "Crear una función que invierta un string",
  "Hacer un loop que imprima los números pares del 1 al 20",
  "Crear un objeto que almacene nombres y edades y devuelva la mayor edad"
];

const lessons = {
  "js": "JavaScript es un lenguaje de scripting que corre en navegadores y Node.js. Variables: `let` y `const`. Funciones: `function nombre() {}`",
  "py": "Python es un lenguaje de scripting simple. Variables se crean directamente: `x = 5`. Funciones: `def nombre():`"
};

// ====== Inicializar cliente Discord ======
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// ====== Registrar comandos ======
const commands = [
  new SlashCommandBuilder().setName("ask").setDescription("Haz una pregunta de programación").addStringOption(option =>
    option.setName("pregunta").setDescription("Tu pregunta").setRequired(true)
  ),
  new SlashCommandBuilder().setName("snippet").setDescription("Pide un snippet de código").addStringOption(option =>
    option.setName("codigo").setDescription("Snippet que quieres").setRequired(true)
  ),
  new SlashCommandBuilder().setName("challenge").setDescription("Recibe un reto de programación"),
  new SlashCommandBuilder().setName("learn").setDescription("Recibe una mini-lección").addStringOption(option =>
    option.setName("lenguaje").setDescription("Lenguaje que quieres aprender").setRequired(true)
  )
].map(cmd => cmd.toJSON());

// Registro global de comandos
const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
(async () => {
  try {
    console.log("Registrando comandos...");
    await rest.put(Routes.applicationCommands("1483135557872783420"), { body: commands });
    console.log("Comandos registrados ✅");
  } catch (error) {
    console.error(error);
  }
})();

// ====== Evento ready ======
client.once("ready", () => {
  console.log(`Bot listo! Conectado como ${client.user.tag}`);
});

// ====== Evento interacción ======
client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === "ask") {
    const pregunta = options.getString("pregunta").toLowerCase();
    const respuesta = answers[pregunta] || "No tengo esa respuesta, intenta otra pregunta.";
    await interaction.reply(respuesta);
  }

  if (commandName === "snippet") {
    const codigo = options.getString("codigo").toLowerCase();
    const snippet = snippets[codigo] || "Snippet no encontrado 😢";
    await interaction.reply(`\`\`\`\n${snippet}\n\`\`\``);
  }

  if (commandName === "challenge") {
    const reto = challenges[Math.floor(Math.random() * challenges.length)];
    await interaction.reply(`🎯 Reto: ${reto}`);
  }

  if (commandName === "learn") {
    const lenguaje = options.getString("lenguaje").toLowerCase();
    const lesson = lessons[lenguaje] || "No tengo lección de ese lenguaje 😢";
    await interaction.reply(lesson);
  }
});

// ====== Web service para Render ======
app.get("/", (req, res) => {
  res.send("Bot Offline Dev funcionando!");
});

app.listen(PORT, () => console.log(`Servidor web corriendo en puerto ${PORT}`));

// ====== Conectar bot ======
client.login(DISCORD_TOKEN);
