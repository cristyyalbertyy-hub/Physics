import { useMemo, useState } from 'react';
import { groups, type GroupId } from './data/curriculum';
import { SubchapterContent } from './components/SubchapterContent';
import { assetUrl } from './utils/assetUrl';

type Selection = { groupId: GroupId; subId: string };

function collapsedGroups(): Record<GroupId, boolean> {
  const init: Partial<Record<GroupId, boolean>> = {};
  for (const g of groups) init[g.id] = false;
  return init as Record<GroupId, boolean>;
}

export default function App() {
  const [openGroups, setOpenGroups] = useState<Record<GroupId, boolean>>(collapsedGroups);
  const [selection, setSelection] = useState<Selection | null>(null);

  const selected = useMemo(() => {
    if (!selection) return null;
    const g = groups.find((x) => x.id === selection.groupId);
    const sub = g?.subchapters.find((s) => s.id === selection.subId);
    if (!g || !sub) return null;
    return { g, sub };
  }, [selection]);

  const toggleGroup = (id: GroupId) => {
    setOpenGroups((o) => ({ ...o, [id]: !o[id] }));
  };

  const selectSubchapter = (sel: Selection) => {
    setSelection(sel);
    setOpenGroups(collapsedGroups());
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Physics</h1>
        <p className="tagline">Structured lessons with video, podcast, infographic, and questionnaire.</p>
      </header>

      <div className="layout">
        <nav className="sidebar" aria-label="Course sections">
          {groups.map((g) => {
            const open = openGroups[g.id];
            return (
              <div key={g.id} className="accordion">
                <button
                  type="button"
                  className="accordion-trigger"
                  onClick={() => toggleGroup(g.id)}
                  aria-expanded={open}
                >
                  <span className="chevron" aria-hidden>
                    {open ? '◀' : '▶'}
                  </span>
                  <span className="group-name">{g.title}</span>
                </button>
                {open ? (
                  <ul className="sub-list">
                    {g.subchapters.map((s) => {
                      const active = selection?.groupId === g.id && selection?.subId === s.id;
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            className={`sub-link${active ? ' active' : ''}`}
                            onClick={() => selectSubchapter({ groupId: g.id, subId: s.id })}
                          >
                            {s.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </nav>

        <main className={`main${selected ? '' : ' main--entry'}`}>
          {selected ? (
            <SubchapterContent groupId={selected.g.id} sub={selected.sub} />
          ) : (
            <div className="entry-panel">
              <img
                src={assetUrl('/Physics_I.png')}
                alt="Physics course overview"
                className="entry-image"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
