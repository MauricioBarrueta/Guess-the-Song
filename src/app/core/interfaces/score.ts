export interface ScoreResults {
    index: number,
    preview: string,
    selectedTrack: string,
    correctTrack: string,
    result: boolean // 'correct' | 'incorrect'
}


//! AL LLEGAR A LA ÚLTIMA PREGUNTA IMPRIME EL SCORE, APARENTEMENTE ESA PARTE YA QUEDÓ
//* EL PREVIEW SE GUARDA PARA QUE EL USUARIO PUEDA VOLVER A ESCUCHARLO CUANDO SE MUESTREN LOS RESULTADOS :D
// [
//   {
//     "index": 0,
//     "preview": "https://cdnt-preview.dzcdn.net/api/1/1/9/5/9/0/9598ec2d73d2636f8eb887d848a38a80.mp3?hdnea=exp=1782499853~acl=/api/1/1/9/5/9/0/9598ec2d73d2636f8eb887d848a38a80.mp3*~data=user_id=0,application_id=42~hmac=47df438d8c38a9d81e38cac5bb283a254a17521233dc4232077d8916eb69f9f5",
//     "selectedTrack": "Red Hands Never Fade",
//     "correctTrack": "Red Hands Never Fade",
//     "result": true
//   },
//   {
//     "index": 1,
//     "preview": "https://cdnt-preview.dzcdn.net/api/1/1/c/f/5/0/cf50cc66260be3a72f5b86e55ce190ee.mp3?hdnea=exp=1782499853~acl=/api/1/1/c/f/5/0/cf50cc66260be3a72f5b86e55ce190ee.mp3*~data=user_id=0,application_id=42~hmac=7b7b54427b0b2dc882a9d613243cd69490e97a82e724fea7c92fee01240e4107",
//     "selectedTrack": "let me burn",
//     "correctTrack": "let me burn",
//     "result": true
//   },
//   {
//     "index": 2,
//     "preview": "https://cdnt-preview.dzcdn.net/api/1/1/d/3/c/0/d3c070794603d8f5e95926d6dd8111b7.mp3?hdnea=exp=1782499853~acl=/api/1/1/d/3/c/0/d3c070794603d8f5e95926d6dd8111b7.mp3*~data=user_id=0,application_id=42~hmac=a6ee152608cf024741e983dcb36ecf7b04273c38720d6db2f5e722e230afe3e6",
//     "selectedTrack": "ERROR",
//     "correctTrack": "Eternal Love",
//     "result": false
//   },
//   {
//     "index": 3,
//     "preview": "https://cdnt-preview.dzcdn.net/api/1/1/2/1/b/0/21b7701b8313b594c391df557f996f45.mp3?hdnea=exp=1782499853~acl=/api/1/1/2/1/b/0/21b7701b8313b594c391df557f996f45.mp3*~data=user_id=0,application_id=42~hmac=2765f976586705d75feb608a36149817811ba003d35f3cf24a38bfd81d02e285",
//     "selectedTrack": "Our Mistakes",
//     "correctTrack": "The One",
//     "result": false
//   },
//   {
//     "index": 4,
//     "preview": "https://cdnt-preview.dzcdn.net/api/1/1/3/c/7/0/3c72e27a983f316667bde729db9bf037.mp3?hdnea=exp=1782499853~acl=/api/1/1/3/c/7/0/3c72e27a983f316667bde729db9bf037.mp3*~data=user_id=0,application_id=42~hmac=3a420dce9d6afda838cdccc1ce01676d7ef1b3b8fd2c6f65be80eac15d62737a",
//     "selectedTrack": "Queen of the Murder Scene",
//     "correctTrack": "Queen of the Murder Scene",
//     "result": true
//   }
// ]