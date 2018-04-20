export interface Spectrogram {
  rotateX: (x:number) => void;
  rotateY: (y:number) => void;
  rotateZ: (z:number) => void;
  toggleGrid: (grid:boolean) => void;
  switchAnalysisType: (type:number) => void;
  play: (src:string) => void;
  stop: () => void;
  stopRender: () => void;
  startRender: () => void;

}
