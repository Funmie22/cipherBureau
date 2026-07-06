export const dailyCases = [
  {
    id: 'case_midnight_ledger',
    title: 'The Midnight Ledger',
    location: 'Harbor District, London',
    synopsis:
      'A priceless relic vanished from a sealed museum vault overnight, and the only evidence left behind is a ciphered note and a handful of contradictory witness statements.',
    mood: 'A procedural thriller with a strong social deduction hook.',
    dossier: {
      timeline: [
        '22:40 — Museum alarms remained silent for 14 minutes.',
        '22:52 — The east service tunnel was opened from the inside.',
        '23:06 — Security cameras lost power for 8 seconds.',
        '23:17 — The relic case was found empty, but untouched by force.'
      ],
      interviews: [
        {
          name: 'Mina Ortiz',
          role: 'Night curator',
          quote: 'The vault felt wrong the moment I stepped inside. Something about the air changed.'
        },
        {
          name: 'Theo Bell',
          role: 'Facilities technician',
          quote: 'I noticed a faint metallic smell near the service tunnel and a fresh scrape on the bronze latch.'
        },
        {
          name: 'Rae Kim',
          role: 'Archivist',
          quote: 'Someone knew exactly which exhibit mattered. They skipped the obvious treasures and took the one with the old ledger.'
        }
      ],
      report:
        'The theft appears internal. The missing relic was not taken by brute force, but by precise knowledge of the vault layout and the museum’s maintenance cycle.'
    },
    clue: {
      title: 'Cipher lock',
      prompt:
        'The final note reads: “QJZ YR VJRQ”. Decode the message to reveal the evidence keyword that unlocks the accusation board.',
      answer: 'MORSE'
    },
    accusation: {
      suspects: [
        { id: 'suspect_mina', name: 'Mina Ortiz', detail: 'The curator with access and the strongest motive to protect a family legacy.' },
        { id: 'suspect_theo', name: 'Theo Bell', detail: 'The facilities chief who knows the tunnel routes and maintenance timings.' },
        { id: 'suspect_rae', name: 'Rae Kim', detail: 'The archivist who could identify the value of the relic and the hidden paperwork.' }
      ],
      evidence: [
        { id: 'evidence_service_tunnel', label: 'Service tunnel scrape', detail: 'Fresh scrape marks near the bronze latch.' },
        { id: 'evidence_maintenance_log', label: 'Maintenance log', detail: 'A log entry showing the power cycle line-up used by the thief.' },
        { id: 'evidence_cipher_note', label: 'Cipher note', detail: 'A short coded note that points to the evidence keyword.' }
      ],
      motives: [
        { id: 'motive_legacy', label: 'Legacy debt', detail: 'A personal debt tied to the museum’s old founder family.' },
        { id: 'motive_fame', label: 'Fame and notoriety', detail: 'A public stunt meant to make the thief unforgettable.' },
        { id: 'motive_money', label: 'Cold cash', detail: 'A sale to a private collector was already arranged.' }
      ]
    },
    solution: {
      suspectId: 'suspect_theo',
      evidenceId: 'evidence_service_tunnel',
      motiveId: 'motive_legacy'
    }
  },
  {
    id: 'case_silver_harbor',
    title: 'Silver Harbor Signal',
    location: 'North Quay, Copenhagen',
    synopsis:
      'A coastal archive lost a sealed shipping ledger during a storm, but the incident report suggests the theft was staged to hide a much older crime.',
    mood: 'A moody investigative case built around misdirection and inference.',
    dossier: {
      timeline: [
        '04:10 — A storm warning interrupted the harbor cameras.',
        '04:22 — A single docklight flickered three times.',
        '04:31 — The archive office lock reported a false “closed” state.',
        '04:45 — The ledger was gone, but the dust patterns were inconsistent.'
      ],
      interviews: [
        {
          name: 'Jules Mercer',
          role: 'Harbor guard',
          quote: 'The dock lights looked like a code. One blink, two blinks, then silence.'
        },
        {
          name: 'Nia Voss',
          role: 'Archivist',
          quote: 'The ledger was never meant for a buyer. It was meant to be hidden in plain sight.'
        },
        {
          name: 'Owen Hart',
          role: 'Storm repair crew',
          quote: 'We found a brass key with dried salt on it near the service ramp.'
        }
      ],
      report:
        'Evidence suggests the thief used an old signal pattern to redirect the guard and then replaced the missing item with a decoy ledger.'
    },
    clue: {
      title: 'Signal code',
      prompt:
        'The harbor code reads “LQJQK” and points to the hidden evidence word. Decode the word to continue.',
      answer: 'NORTH'
    },
    accusation: {
      suspects: [
        { id: 'suspect_jules', name: 'Jules Mercer', detail: 'The guard who understood the signal pattern and was near the dock.' },
        { id: 'suspect_nia', name: 'Nia Voss', detail: 'The archivist who knew which record mattered to the thief.' },
        { id: 'suspect_owen', name: 'Owen Hart', detail: 'The repair worker with access to the service ramp and hidden storage.' }
      ],
      evidence: [
        { id: 'evidence_brass_key', label: 'Brass key', detail: 'A key with cold salt residue from the dockside.' },
        { id: 'evidence_decoy_ledger', label: 'Decoy ledger', detail: 'A false ledger left behind to misdirect the investigation.' },
        { id: 'evidence_signal_log', label: 'Signal log', detail: 'A schedule of repeated docklight patterns.' }
      ],
      motives: [
        { id: 'motive_coverup', label: 'Cover-up', detail: 'The theft was meant to conceal an older crime.' },
        { id: 'motive_revenge', label: 'Revenge', detail: 'A personal grudge against the archive leadership.' },
        { id: 'motive_profit', label: 'Profit', detail: 'The ledger would have been sold to a private collector.' }
      ]
    },
    solution: {
      suspectId: 'suspect_owen',
      evidenceId: 'evidence_brass_key',
      motiveId: 'motive_coverup'
    }
  },
  {
    id: 'case_ember_station',
    title: 'Ember Station',
    location: 'Riverside Junction, Tokyo',
    synopsis:
      'A vanished train timetable was stolen from a transit museum during a controlled blackout, and every witness remembers the same orange glow.',
    mood: 'Fast, cinematic, and built for a strong final accusation moment.',
    dossier: {
      timeline: [
        '19:03 — The station lights dimmed for exactly 11 seconds.',
        '19:05 — A maintenance drone was seen circling the west platform.',
        '19:12 — The timetable display was replaced with a blank panel.',
        '19:18 — An orange glow was spotted near the old ticket office.'
      ],
      interviews: [
        {
          name: 'Sae Noda',
          role: 'Museum attendant',
          quote: 'The glow came from a handheld lantern, not the station lamps.'
        },
        {
          name: 'Darren Pike',
          role: 'Transit engineer',
          quote: 'The maintenance drone was never meant to be in that corridor.'
        },
        {
          name: 'Lina Cho',
          role: 'Ticketing clerk',
          quote: 'The thief took the timetable and left the station map behind. That was deliberate.'
        }
      ],
      report:
        'The theft was a precise retrieval rather than a smash-and-grab. Someone used the blackout to swap the target and leave a false trail.'
    },
    clue: {
      title: 'Transit cipher',
      prompt:
        'The orange signal points to the evidence word hidden in the phrase “ZYREH”. Decode the word to unlock the evidence board.',
      answer: 'HOLLOW'
    },
    accusation: {
      suspects: [
        { id: 'suspect_sae', name: 'Sae Noda', detail: 'The attendant who saw the orange glow and had access to the ticket office.' },
        { id: 'suspect_darren', name: 'Darren Pike', detail: 'The engineer with direct access to the maintenance drone route.' },
        { id: 'suspect_lina', name: 'Lina Cho', detail: 'The clerk who knew the timetable mattered more than the map.' }
      ],
      evidence: [
        { id: 'evidence_orange_glow', label: 'Orange lantern glow', detail: 'The handheld light seen during the blackout.' },
        { id: 'evidence_drifted_drone', label: 'Drone flight log', detail: 'A maintenance log that places the drone at the west platform.' },
        { id: 'evidence_blank_panel', label: 'Blank timetable panel', detail: 'A replacement screen used to divert attention.' }
      ],
      motives: [
        { id: 'motive_obsession', label: 'Obsession', detail: 'A collector fixated on the station legacy.' },
        { id: 'motive_bribe', label: 'Bribe', detail: 'A payoff to remove the timetable before a deal.' },
        { id: 'motive_rescue', label: 'Rescue', detail: 'The timetable was stolen to protect someone else’s secret.' }
      ]
    },
    solution: {
      suspectId: 'suspect_darren',
      evidenceId: 'evidence_drifted_drone',
      motiveId: 'motive_rescue'
    }
  }
];
