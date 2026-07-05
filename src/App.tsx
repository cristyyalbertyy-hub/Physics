import { useEffect, useMemo, useRef, useState } from 'react';
import { SubchapterContent } from './components/SubchapterContent';
import { courseTitle, groups, type GroupId } from './data/curriculum';
import { assetUrl } from './utils/assetUrl';

type Selection = { groupId: GroupId; subId: string };

function collapsedRecord(ids: GroupId[]): Record<GroupId, boolean> {
  const init: Partial<Record<GroupId, boolean>> = {};
  for (const id of ids) init[id] = false;
  return init as Record<GroupId, boolean>;
}

export default function App() {
  const [openGroups, setOpenGroups] = useState(() => collapsedRecord(groups.map((g) => g.id)));
  const [selection, setSelection] = useState<Selection | null>(null);
  const [atHome, setAtHome] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  const selected = useMemo(() => {
    if (!selection) return null;
    const g = groups.find((x) => x.id === selection.groupId);
    const sub = g?.subchapters.find((s) => s.id === selection.subId);
    if (!g || !sub) return null;
    return { g, sub };
  }, [selection]);

  const isBrowsing = !selected && !atHome;

  const activeGroupId = useMemo(() => {
    if (selected) return selected.g.id;
    if (selection && !atHome) return selection.groupId;
    return groups.find((g) => openGroups[g.id])?.id ?? null;
  }, [selected, selection, atHome, openGroups]);

  const browsingContext = useMemo(() => {
    if (!selection || selected) return null;
    const group = groups.find((g) => g.id === selection.groupId);
    if (!group) return null;
    return { group };
  }, [selection, selected]);

  const mobileLessonContext = useMemo(() => {
    if (selected) {
      return {
        chapter: selected.g.title,
        subchapter: selected.sub.title,
        color: selected.g.color,
      };
    }
    if (browsingContext) {
      return {
        chapter: browsingContext.group.title,
        subchapter: 'Choose a sub-topic',
        color: browsingContext.group.color,
      };
    }
    return null;
  }, [selected, browsingContext]);

  const showMobileLessonBar = !mobileMenuOpen && !atHome && mobileLessonContext !== null;
  const shellMode = mobileMenuOpen ? 'is-mobile-menu' : 'is-mobile-content';

  const overviewImage = assetUrl('/Physics_I.png');

  const overviewPanel = (
    <div className="overview-panel">
      <div className="overview-intro">
        <p className="overview-lead">
          Mechanics, electromagnetism, waves, thermodynamics, nuclear physics and fluids — six
          groups with video, podcast, infographic and quiz for each sub-topic.
        </p>
        <ul className="overview-systems" aria-label="Course groups">
          {groups.map((group) => (
            <li
              key={group.id}
              className="overview-systems__item"
              style={{ borderLeftColor: group.color }}
            >
              <strong>{group.title}</strong>
              <span>
                {group.subchapters.length}{' '}
                {group.subchapters.length === 1 ? 'sub-topic' : 'sub-topics'}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <img
        src={overviewImage}
        alt="Physics — course overview"
        className="overview-infographic"
      />
      <p className="overview-hint muted">
        Open a coloured chapter below, then choose a sub-topic to start.
      </p>
      <button type="button" className="mobile-browse-btn" onClick={() => setMobileMenuOpen(true)}>
        Browse chapters →
      </button>
    </div>
  );

  const toggleGroup = (id: GroupId) => {
    setOpenGroups((o) => ({ ...o, [id]: !o[id] }));
  };

  const selectSubchapter = (sel: Selection) => {
    setAtHome(false);
    setSelection(sel);
    setMobileMenuOpen(false);

    const nextGroups = collapsedRecord(groups.map((g) => g.id));
    nextGroups[sel.groupId] = true;
    setOpenGroups(nextGroups);
  };

  const lessonScrollKey = selected
    ? `${selected.g.id}:${selected.sub.id}`
    : null;

  useEffect(() => {
    if (!lessonScrollKey) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [lessonScrollKey]);

  const goToEntry = () => {
    setAtHome(true);
    setSelection(null);
    setMobileMenuOpen(false);
    setOpenGroups(collapsedRecord(groups.map((g) => g.id)));
  };

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
  };

  return (
    <div className={`app-shell ${shellMode}`}>
      <header className={`app-header${showMobileLessonBar ? ' app-header--compact-mobile' : ''}`}>
        <button
          type="button"
          className="home-overview-btn"
          onClick={goToEntry}
          aria-label="Back to course overview"
        >
          <span className="home-overview-btn__media">
            <img src={overviewImage} alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <span className="home-overview-btn__fallback" aria-hidden>
              ⊕
            </span>
          </span>
          <span className="home-overview-btn__label">Course overview</span>
        </button>
        <h1>{courseTitle}</h1>
      </header>

      {showMobileLessonBar && mobileLessonContext ? (
        <div
          className="mobile-lesson-bar"
          style={{ borderLeftColor: mobileLessonContext.color }}
        >
          <button type="button" className="mobile-menu-back" onClick={openMobileMenu}>
            ← Menu
          </button>
          <div className="mobile-lesson-bar__text">
            <span className="mobile-lesson-bar__chapter">{mobileLessonContext.chapter}</span>
            <span className="mobile-lesson-bar__sub">{mobileLessonContext.subchapter}</span>
          </div>
        </div>
      ) : null}

      <div className="layout">
        <div className="sidebar-column">
          <nav className="sidebar" aria-label={courseTitle}>
            {groups.map((g) => {
              const open = openGroups[g.id];
              return (
                <div
                  key={g.id}
                  className={`accordion accordion--group${open ? ' is-open' : ''}`}
                  data-group={g.id}
                >
                  <button
                    type="button"
                    className="accordion-trigger accordion-trigger--group"
                    style={{ backgroundColor: g.color }}
                    aria-expanded={open}
                    onClick={() => toggleGroup(g.id)}
                  >
                    <span className="chevron" aria-hidden>
                      {open ? '▼' : '▶'}
                    </span>
                    <span className="group-name">{g.title}</span>
                  </button>
                  {open ? (
                    <div className="sub-tree" style={{ borderTopColor: g.color }}>
                      <ul className="sub-list">
                        {g.subchapters.map((s) => {
                          const active =
                            selection?.groupId === g.id && selection?.subId === s.id;
                          return (
                            <li key={s.id}>
                              <button
                                type="button"
                                className={`sub-link${active ? ' active' : ''}`}
                                onClick={() => selectSubchapter({ groupId: g.id, subId: s.id })}
                              >
                                <span className="sub-link-title">{s.title}</span>
                                <span className="sub-link-arrow" aria-hidden>
                                  ›
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </div>

        <main
          ref={mainRef}
          className={`main${atHome ? ' main--overview' : ''}${isBrowsing ? ' main--browsing' : ''}`}
          data-system-tint={activeGroupId ?? undefined}
        >
          {atHome ? (
            overviewPanel
          ) : selected ? (
            <SubchapterContent groupId={selected.g.id} sub={selected.sub} groupTitle={selected.g.title} />
          ) : (
            <div className="browse-view">
              <div className="media-stage media-stage--placeholder">
                {browsingContext ? (
                  <>
                    <p className="eyebrow">{browsingContext.group.title}</p>
                    <h2 className="browse-title">Choose a sub-topic</h2>
                    <p className="browse-hint">
                      Pick a sub-topic in the menu to open video, podcast, infographic and questions.
                    </p>
                  </>
                ) : (
                  <p>Choose a coloured chapter in the menu on the left, then select a sub-topic.</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
