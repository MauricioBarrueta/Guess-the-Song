export interface ScoreResults {
    index: number,
    album: string,
    preview: string,
    selectedTrack: string,
    correctTrack: string,
    result: boolean // 'correct' | 'incorrect'
}