import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import { FormattedTime } from 'react-intl';
import dates from './utils/dates';
import { accessor, elementType } from './utils/propTypes';
import { accessor as get } from './utils/accessors';

import IconButton from '@folio/stripes-components/lib/IconButton';

const propTypes = {
  event: PropTypes.object.isRequired,
  slotStart: PropTypes.instanceOf(Date),
  slotEnd: PropTypes.instanceOf(Date),

  selected: PropTypes.bool,
  isAllDay: PropTypes.bool,
  eventPropGetter: PropTypes.func,
  titleAccessor: accessor,
  tooltipAccessor: accessor,
  allDayAccessor: accessor,
  startAccessor: accessor,
  endAccessor: accessor,

  eventComponent: elementType,
  eventWrapperComponent: elementType.isRequired,
  onSelect: PropTypes.func,
  onDoubleClick: PropTypes.func
};

class EventCell extends React.Component {
  render() {
    const {
      className,
      event,
      selected,
      isAllDay,
      eventPropGetter,
      startAccessor,
      endAccessor,
      titleAccessor,
      tooltipAccessor,
      allDayAccessor,
      slotStart,
      slotEnd,
      onSelect,
      onDoubleClick,
      eventComponent: Event,
      eventWrapperComponent: EventWrapper,
      ...props
    } = this.props;

    const title = get(event, titleAccessor);


    const tooltip = get(event, tooltipAccessor);


    const end = get(event, endAccessor);


    const start = get(event, startAccessor);


    const allDay = get(event, allDayAccessor);


    const isAllDayEvent =
        isAllDay ||
        allDay ||
        dates.diff(start, dates.ceil(end, 'day'), 'day') > 1;


    const continuesPrior = dates.lt(start, slotStart, 'day');


    const continuesAfter = dates.gte(end, slotEnd, 'day');

    if (eventPropGetter) {
      var { style, className: xClassName } = eventPropGetter(
        event,
        start,
        end,
        selected
      );
    }

    const wrapperProps = {
      event,
      allDay,
      continuesPrior,
      continuesAfter,
    };

    let header;
    if (this.props.label === null || this.props.label === undefined) {
      header = <div><FormattedTime value={start} /> - <FormattedTime value={end} /></div>;
    }
    let color = '#3174ad';
    let content;
    if (this.props.label === null || this.props.label === undefined) {
      content = <IconButton
        className="rbc-allday-event-close"
        icon="closeX"
        iconSize="small"
        onClick={() => { this.props.onDeleteAlldayEvent(event); }}
      />;
    } else if (this.props.label !== null) {
      content = title;
      color = '#fcfcfc';
    }


    return (
      <EventWrapper {...wrapperProps} isRow>
        <div
          style={{ ...props.style, ...style, backgroundColor: color }}
          className={cn('rbc-event', className, xClassName, {
            'rbc-selected': selected,
            'rbc-event-allday': isAllDayEvent,
            'rbc-event-continues-prior': continuesPrior,
            'rbc-event-continues-after': continuesAfter
          })}
          onClick={e => onSelect(event, e)}
          onDoubleClick={e => onDoubleClick(event, e)}
        >
          <div className="rbc-event-content" title={tooltip || undefined}>
            { Event
              ? <Event event={event} title={title} isAllDay={isAllDayEvent} />
              : (<div>
                <div className="rbc-allday-event-content">
                  {header}
                </div>
                <div>
                  <div onClick={() => { this.props.getEvent(event); }} >
                    {content}
                  </div>
                </div>
              </div>)
            }
          </div>
        </div>
      </EventWrapper>
    );
  }
}

EventCell.propTypes = propTypes;

export default EventCell;
