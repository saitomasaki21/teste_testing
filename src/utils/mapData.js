// mapData.js
export const trails = [
  {
    id: 1,
    name: "Trilha da Floresta",
    coordinates: [
      [-59.9737051, -3.1002428],
      [-59.9735557, -3.100295],
      [-59.9734449, -3.1003094],
      // ... (restante das coordenadas)
      [-59.9685026, -3.100383]
    ], // ← Esta vírgula estava faltando
    imageIds: [
      442254198480056,
      1680650176124830,
      // ... (restante dos imageIds)
      441000492337699
    ]
  },
  {
    id: 2,
    name: "Trilha do Lago",
    coordinates: [
      [-59.9726171, -3.1004695],
      [-59.9726367, -3.1004487],
      // ... (restante das coordenadas)
      [-59.9665582, -3.1048868]
    ],
    imageIds: [
      803250865353246,
      497273466525272,
      // ... (restante dos imageIds)
      516560174462463
    ]
  }
];
