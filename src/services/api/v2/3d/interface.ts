export interface API3DQueryBody {
  startDate: string
  stopDate: string
}

export interface API3DResponse {
  title:       string;
  description: string;
  data:        Datum[];
}

export interface Datum {
  _id:           string;
  stamp:         Date;
  timestamp:     Date;
  id:            string;
  pathPCD:       string;
  pathPCDImage:  string;
  pathImage:     string;
  license_plate: string;
  province:      string;
  typeCar:       string;
  station:       string;
  stationId:     string;
  stationIp:     string;
  lane:          number;
  width:         number;
  long:          number;
  hight:         number;
  __v:           number;
}
