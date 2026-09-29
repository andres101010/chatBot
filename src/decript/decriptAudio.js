import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import ffmpeg from "fluent-ffmpeg";
import { decryptMedia } from "@open-wa/wa-decrypt";
import dotenv from "dotenv";
dotenv.config();

// 📥 1. Descargar el archivo de audio .enc
async function downloadEncryptedFile(url, outputPath) {
  const response = await axios({
    method: "GET",
    url,
    responseType: "stream"
  });

  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// 🎧 2. Desencriptar el archivo .enc usando mediaKey
async function decryptVoiceMessage(message, encPath, outPath) {
    console.log("encPath",encPath)
  const decrypted = await decryptMedia(message,encPath);
  fs.writeFileSync(outPath, decrypted);
}

// 🔄 3. Convertir de .ogg a .wav
function convertToWav(input, output) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .toFormat("wav")
      .on("end", resolve)
      .on("error", reject)
      .save(output);
  });
}

// 🧠 4. Transcribir audio con Whisper de OpenAI
async function transcribeAudio(filePath) {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  formData.append("model", "whisper-1");

  const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      ...formData.getHeaders()
    }
  });

  return response.data.text;
}


// 🚀 5. Función principal que orquesta todo
async function main(values) {
    console.log("Directorio actual de trabajo:", process.cwd());
    console.log("Ejecutando main......");


    const message = {
      deprecatedMms3Url: values?._data?.deprecatedMms3Url,
      mimetype: values?._data?.mimetype,
      mediaKey: values?._data?.mediaKey,
      type: values?._data?.type,
      filehash: values?._data?.filehash,
      size: values?._data?.size
    };


  if (!message.deprecatedMms3Url) {
    console.error("URL no válida o no definida:");
    return;
    }
  console.log("Descargando audio...");
  await downloadEncryptedFile(message.deprecatedMms3Url, "./audio.enc");

  if (!message.deprecatedMms3Url || !message.mediaKey || !message.filehash || !message.mimetype || !message.size) {
  console.error("Faltan datos para desencriptar el audio:", message);
  return;
}


  console.log("Desencriptando...");
  await decryptVoiceMessage(message, "./audio.enc", "./audio.ogg");

  console.log("Convirtiendo a WAV...");
  await convertToWav("./audio.ogg", "./audio.wav");

  console.log("Enviando a OpenAI...");
  const texto = await transcribeAudio("./audio.wav");

  // console.log("✅ Transcripción:");
  // console.log(texto);
  return texto
}

export default main;







// mesageeeeeeee Message {
//   _data: {
//     id: {
//       fromMe: false,
//       remote: '5493884535200@c.us',
//       id: '3FAD98DCDC44F2AC9E72',
//       _serialized: 'false_5493884535200@c.us_3FAD98DCDC44F2AC9E72'
//     },
//     viewed: false,
//     type: 'ptt',
//     t: 1747425851,
//     notifyName: 'Andrés',
//     from: '5493884535200@c.us',
//     to: '59164313491@c.us',
//     ack: 1,
//     invis: false,
//     isNewMsg: true,
//     star: false,
//     kicNotified: false,
//     recvFresh: true,
//     deprecatedMms3Url: 'https://mmg.whatsapp.net/v/t62.7117-24/11889828_1150222523540891_7194486398691664638_n.enc?ccb=11-4&oh=01_Q5Aa1gH5WyXEPbmOkGOhCwXyT073diT8vwY1TXdAlIlk3OCysQ&oe=684F1B2A&_nc_sid=5e03e0&mms3=true',
//     directPath: '/v/t62.7117-24/11889828_1150222523540891_7194486398691664638_n.enc?ccb=11-4&oh=01_Q5Aa1gH5WyXEPbmOkGOhCwXyT073diT8vwY1TXdAlIlk3OCysQ&oe=684F1B2A&_nc_sid=5e03e0',
//     mimetype: 'audio/ogg; codecs=opus',
//     duration: '2',
//     filehash: 'hmi0ETajDd8dE7RMkei84KD9yHmpX8M8b97uvsanbEA=',
//     encFilehash: '17C/YoCnq4W1IcHX0b+tl1srUqoAj6lsLVsVpUutszk=',
//     size: 12720,
//     streamingSidecar: {},
//     mediaKey: '98Ho6GqGL9nYZiL/yy7g2FoXBcnucqyRJxt7eCqeAlw=',
//     mediaKeyTimestamp: 1747425851,
//     isViewOnce: false,
//     waveform: {
//       '0': 40,
//       '1': 42,
//       '2': 43,
//       '3': 45,
//       '4': 47,
//       '5': 49,
//       '6': 46,
//       '7': 42,
//       '8': 38,
//       '9': 34,
//       '10': 30,
//       '11': 31,
//       '12': 37,
//       '13': 42,
//       '14': 48,
//       '15': 54,
//       '16': 59,
//       '17': 62,
//       '18': 66,
//       '19': 70,
//       '20': 73,
//       '21': 77,
//       '22': 71,
//       '23': 64,
//       '24': 58,
//       '25': 52,
//       '26': 46,
//       '27': 46,
//       '28': 48,
//       '29': 49,
//       '30': 51,
//       '31': 53,
//       '32': 54,
//       '33': 54,
//       '34': 54,
//       '35': 54,
//       '36': 54,
//       '37': 54,
//       '38': 55,
//       '39': 56,
//       '40': 57,
//       '41': 58,
//       '42': 59,
//       '43': 58,
//       '44': 57,
//       '45': 56,
//       '46': 55,
//       '47': 54,
//       '48': 54,
//       '49': 54,
//       '50': 53,
//       '51': 53,
//       '52': 53,
//       '53': 54,
//       '54': 56,
//       '55': 58,
//       '56': 60,
//       '57': 62,
//       '58': 62,
//       '59': 57,
//       '60': 51,
//       '61': 46,
//       '62': 41,
//       '63': 35
//     },
//     isFromTemplate: false,
//     pollInvalidated: false,
//     isSentCagPollCreation: false,
//     latestEditMsgKey: null,
//     latestEditSenderTimestampMs: null,
//     mentionedJidList: [],
//     groupMentions: [],
//     isEventCanceled: false,
//     eventInvalidated: false,
//     isVcardOverMmsDocument: false,
//     labels: [],
//     hasReaction: false,
//     ephemeralDuration: 0,
//     ephemeralSettingTimestamp: 0,
//     disappearingModeInitiator: 'chat',
//     disappearingModeTrigger: 'chat_settings',
//     viewMode: 'VISIBLE',
//     productHeaderImageRejected: false,
//     lastPlaybackProgress: 0,
//     isDynamicReplyButtonsMsg: false,
//     isCarouselCard: false,
//     parentMsgId: null,
//     callSilenceReason: null,
//     isVideoCall: false,
//     callDuration: null,
//     callParticipants: null,
//     isMdHistoryMsg: false,
//     stickerSentTs: 0,
//     isAvatar: false,
//     lastUpdateFromServerTs: 0,
//     invokedBotWid: null,
//     bizBotType: null,
//     botResponseTargetId: null,
//     botPluginType: null,
//     botPluginReferenceIndex: null,
//     botPluginSearchProvider: null,
//     botPluginSearchUrl: null,
//     botPluginSearchQuery: null,
//     botPluginMaybeParent: false,
//     botReelPluginThumbnailCdnUrl: null,
//     botMessageDisclaimerText: null,
//     botMsgBodyType: null,
//     reportingTokenInfo: { reportingTag: [Object] },
//     requiresDirectConnection: null,
//     bizContentPlaceholderType: null,
//     hostedBizEncStateMismatch: false,
//     senderOrRecipientAccountTypeHosted: false,
//     placeholderCreatedWhenAccountIsHosted: false,
//     links: []
//   },
//   mediaKey: '98Ho6GqGL9nYZiL/yy7g2FoXBcnucqyRJxt7eCqeAlw=',
//   id: {
//     fromMe: false,
//     remote: '5493884535200@c.us',
//     id: '3FAD98DCDC44F2AC9E72',
//     _serialized: 'false_5493884535200@c.us_3FAD98DCDC44F2AC9E72'
//   },
//   ack: 1,
//   hasMedia: true,
//   body: '',
//   type: 'ptt',
//   timestamp: 1747425851,
//   from: '5493884535200@c.us',
//   to: '59164313491@c.us',
//   author: undefined,
//   deviceType: 'web',
//   isForwarded: undefined,
//   forwardingScore: 0,
//   isStatus: false,
//   isStarred: false,
//   broadcast: undefined,
//   fromMe: false,
//   hasQuotedMsg: false,
//   hasReaction: false,
//   duration: '2',
//   location: undefined,
//   vCards: [],
//   inviteV4: undefined,
//   mentionedIds: [],
//   groupMentions: [],
//   orderId: undefined,
//   token: undefined,
//   isGif: false,
//   isEphemeral: undefined,
//   links: []
// }