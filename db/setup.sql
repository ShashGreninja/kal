create table if not exists public.kal_saves (
  id uuid primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.kal_witness_facts (
  id text primary key,
  witness text not null,
  keywords text[] not null,
  fact text not null,
  reveal text
);
alter table public.kal_saves enable row level security;
alter table public.kal_witness_facts enable row level security;
grant select, insert, update on public.kal_saves to service_role;
grant select on public.kal_witness_facts to service_role;

insert into public.kal_witness_facts (id, witness, keywords, fact, reveal) values
('tea-hours', 'nirmala', array['chai','tea','ketli','baarish','चाय','बारिश'], 'Nirmala keeps the kettle on until the last service. Her nephew helps with deliveries.', null),
('tea-warning', 'nirmala', array['warning','desai','nephew','message','runner','18:42','pul','पुल','चेतावनी'], 'Nirmala sent her nephew with Desai’s bridge warning. She did not know the exact time until she saw the duty log.', 'tea-testimony'),
('office-register', 'stationmaster', array['register','station','duty','baarish','रजिस्टर'], 'Kulkarni keeps the register dry under his desk and insists on signing each departure entry.', null),
('office-delay', 'stationmaster', array['warning','unsigned','train','timetable','bridge','18:42','चेतावनी','ट्रेन'], 'Kulkarni received the warning and waited for a signed order. Prakash changed the route before that order arrived.', 'office-testimony'),
('prakash-watch', 'prakash', array['watch','ghadi','beta','घड़ी'], 'Prakash bought his watch with his own wages. His son thinks the railway gave it to him.', null),
('prakash-route', 'prakash', array['siding','bridge','route','signal','lever','goods','pul','पुल','सिग्नल','लाइन'], 'Prakash followed the yellow triangle to the goods siding. All passengers left at 19:13. A carbon copy is in the dispatch drawer.', 'signal-testimony'),
('jadhav-duty', 'jadhav', array['log','report','train','time','लॉग','रिपोर्ट'], 'Jadhav records what he can verify. A runner left a message at 18:42, but he did not read the message.', null),
('jadhav-retired', 'retired', array['prakash','log','report','train','warning','लॉग','रिपोर्ट'], 'Retired Jadhav remembers Prakash as punctual. He regrets recording the route change without asking why it happened.', null),
('jadhav-correction', 'retired', array['log','report','warning','runner','message','18:42','लॉग','रिपोर्ट'], 'Jadhav recorded Nirmala’s nephew at 18:42. The report omitted the message.', 'retired-testimony'),
('desai-survey', 'desai', array['bridge','pul','survey','mark','rain','stone','पुल','पत्थर'], 'Desai saw the bridge stonework shift after the rain. He made a chalk survey mark and sent his warning to the station.', 'desai-testimony'),
('leela-survey', 'leela', array['archive','paper','shelf','flood','tin','कागज़','बारिश'], 'Leela mapped the flood damage for renovation. Paper in the low drawers rotted. The upper shelves stayed dry.', 'leela-testimony')
on conflict (id) do update set keywords = excluded.keywords, fact = excluded.fact, reveal = excluded.reveal;
