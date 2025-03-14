import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from '@internationalized/date';
import { WorkspaceSettings } from '@deephaven/redux';
import {
  parseDateValue,
  parseNullableDateValue,
  isStringInstant,
  parseTimeValue,
  parseNullableTimeValue,
  parseCalendarValue,
  parseNullableCalendarValue,
  dateValuetoIsoString,
  nanosToMillis,
  isCustomDateFormatOptions,
  getFormattedDate,
  getDateTimeFormat,
} from './DateTimeUtils';

const DEFAULT_TIME_ZONE = 'UTC';
const NY_TIME_ZONE = 'America/New_York';

describe('isStringInstant', () => {
  it('should return true for an instant string', () => {
    expect(isStringInstant('2021-03-03T04:05:06Z')).toBeTruthy();
  });
  it('should return false for a non-instant string', () => {
    expect(isStringInstant('2021-03-03T04:05:06')).toBeFalsy();
  });
  it('should return false for null', () => {
    expect(isStringInstant(null)).toBeFalsy();
  });
});

describe('parseDateValue', () => {
  const isoDate = '2021-02-03';
  const isoDateTime = '2021-03-03T04:05:06';
  const isoZonedDateTime = '2021-04-04T05:06:07-04:00[America/New_York]';
  const nonIsoZonedDateTime = '2021-04-04T05:06:07 America/New_York';
  const instantString = '2021-03-03T04:05:06Z';
  const instantStringUTC = '2021-03-03T04:05:06Z[UTC]';
  const utcOutput = '2021-03-03T04:05:06+00:00[UTC]';
  const nyOutput = '2021-03-02T23:05:06-05:00[America/New_York]';
  const invalidDate = 'invalid-date';

  it('should return null if the value is null', () => {
    expect(parseNullableDateValue(DEFAULT_TIME_ZONE, null)).toBeNull();
  });

  it('should return undefined if the value is undefined', () => {
    expect(parseDateValue(DEFAULT_TIME_ZONE, undefined)).toBeUndefined();
  });

  it('should parse an ISO 8601 date string', () => {
    expect(parseDateValue(DEFAULT_TIME_ZONE, isoDate)?.toString()).toEqual(
      isoDate
    );
  });

  it('should parse an ISO 8601 date time string', () => {
    expect(parseDateValue(DEFAULT_TIME_ZONE, isoDateTime)?.toString()).toEqual(
      isoDateTime
    );
  });

  it('should parse an ISO 8601 zoned date time string', () => {
    expect(
      parseDateValue(DEFAULT_TIME_ZONE, isoZonedDateTime)?.toString()
    ).toEqual(isoZonedDateTime);
  });

  it('should parse a non-ISO 8601 zoned date time string', () => {
    expect(
      parseDateValue(DEFAULT_TIME_ZONE, nonIsoZonedDateTime)?.toString()
    ).toEqual(isoZonedDateTime);
  });

  it('should parse an instant string', () => {
    expect(
      parseDateValue(DEFAULT_TIME_ZONE, instantString)?.toString()
    ).toEqual(utcOutput);
    expect(
      parseDateValue(DEFAULT_TIME_ZONE, instantStringUTC)?.toString()
    ).toEqual(utcOutput);
  });

  it('should throw an error if the value is invalid', () => {
    expect(() => parseDateValue(DEFAULT_TIME_ZONE, invalidDate)).toThrow();
  });

  it('should parse an instant time string with a different time zone', () => {
    expect(parseDateValue(NY_TIME_ZONE, instantString)?.toString()).toEqual(
      nyOutput
    );
  });
});

describe('parseTimeValue', () => {
  const isoTime = '04:05:06';
  const isoDateTime = '2021-03-03T04:05:06';
  const isoZonedDateTime = '2021-04-04T05:06:07-04:00[America/New_York]';
  const nonIsoZonedDateTime = '2021-04-04T05:06:07 America/New_York';
  const instantString = '2021-03-03T04:05:06Z';
  const instantStringUTC = '2021-03-03T04:05:06Z[UTC]';
  const utcOutput = '2021-03-03T04:05:06+00:00[UTC]';
  const nyOutput = '2021-03-02T23:05:06-05:00[America/New_York]';
  const invalidTime = 'invalid-time';

  it('should return null if the value is null', () => {
    expect(parseNullableTimeValue(DEFAULT_TIME_ZONE, null)).toBeNull();
  });

  it('should return undefined if the value is undefined', () => {
    expect(parseTimeValue(DEFAULT_TIME_ZONE, undefined)).toBeUndefined();
  });

  it('should parse an ISO 8601 time string', () => {
    expect(parseTimeValue(DEFAULT_TIME_ZONE, isoTime)?.toString()).toEqual(
      isoTime
    );
  });

  it('should parse an ISO 8601 date time string', () => {
    expect(parseTimeValue(DEFAULT_TIME_ZONE, isoDateTime)?.toString()).toEqual(
      isoDateTime
    );
  });

  it('should parse an ISO 8601 zoned date time string', () => {
    expect(
      parseTimeValue(DEFAULT_TIME_ZONE, isoZonedDateTime)?.toString()
    ).toEqual(isoZonedDateTime);
  });

  it('should parse a non-ISO 8601 zoned date time string', () => {
    expect(
      parseTimeValue(DEFAULT_TIME_ZONE, nonIsoZonedDateTime)?.toString()
    ).toEqual(isoZonedDateTime);
  });

  it('should parse an instant string', () => {
    expect(
      parseTimeValue(DEFAULT_TIME_ZONE, instantString)?.toString()
    ).toEqual(utcOutput);
    expect(
      parseTimeValue(DEFAULT_TIME_ZONE, instantStringUTC)?.toString()
    ).toEqual(utcOutput);
  });

  it('should throw an error if the value is invalid', () => {
    expect(() => parseTimeValue(DEFAULT_TIME_ZONE, invalidTime)).toThrow();
  });

  it('should parse an instant time string with a different time zone', () => {
    expect(parseTimeValue(NY_TIME_ZONE, instantString)?.toString()).toEqual(
      nyOutput
    );
  });
});

describe('parseNullableDateValue', () => {
  it('should return null if the value is null', () => {
    expect(parseNullableCalendarValue(null)).toBeNull();
  });
});

describe('parseCalendarValue', () => {
  const isoDate = '2021-02-03';
  const isoDateTime = '2021-03-03T04:05:06';
  const isoZonedDateTime = '2021-04-04T05:06:07-04:00[America/New_York]';
  const nonIsoZonedDateTime = '2021-04-04T05:06:07 America/New_York';
  const instantString = '2021-03-03T04:05:06Z';
  const instantStringUTC = '2021-03-03T04:05:06Z[UTC]';
  const instantStringNoTimeZone = '2021-03-03T04:05:06';
  const utcOutput = '2021-03-03T04:05:06+00:00[UTC]';
  const invalidDate = 'invalid-date';

  it('should return undefined if the value is undefined', () => {
    expect(parseCalendarValue(undefined)).toBeUndefined();
  });

  it('should parse an ISO 8601 date string', () => {
    expect(parseCalendarValue(isoDate)?.toString()).toEqual(isoDate);
  });

  it('should parse an ISO 8601 date time string', () => {
    expect(parseCalendarValue(isoDateTime)?.toString()).toEqual(isoDateTime);
  });

  it('should parse an ISO 8601 zoned date time string', () => {
    expect(parseCalendarValue(isoZonedDateTime)?.toString()).toEqual(
      isoZonedDateTime
    );
  });

  it('should parse a non-ISO 8601 zoned date time string', () => {
    expect(parseCalendarValue(nonIsoZonedDateTime)?.toString()).toEqual(
      isoZonedDateTime
    );
  });

  it('should parse an instant string', () => {
    expect(parseCalendarValue(instantString)?.toString()).toEqual(
      instantStringNoTimeZone
    );
    expect(parseCalendarValue(instantStringUTC)?.toString()).toEqual(utcOutput);
  });

  it('should throw an error if the value is invalid', () => {
    expect(() => parseCalendarValue(invalidDate)).toThrow();
  });
});

describe('dateValuetoIsoString', () => {
  it('handles a CalendarDate', () => {
    const date = new CalendarDate(2021, 3, 4);
    expect(dateValuetoIsoString(date)).toEqual('2021-03-04');
  });

  it('handles a CalendarDateTime', () => {
    const date = new CalendarDateTime(2021, 3, 4, 5, 6, 7);
    expect(dateValuetoIsoString(date)).toEqual('2021-03-04T05:06:07Z');
  });

  it('handles a ZonedDateTime', () => {
    const date = new ZonedDateTime(2021, 3, 4, 'America/New_York', 0, 0, 0, 0);
    expect(dateValuetoIsoString(date)).toEqual(
      '2021-03-04T00:00:00+00:00[America/New_York]'
    );
  });

  describe('nanosToMillis', () => {
    it('should convert nanoseconds to milliseconds', () => {
      expect(nanosToMillis(1000000)).toEqual(1);
    });

    it('should return 0 when 0 nanoseconds is given', () => {
      expect(nanosToMillis(0)).toEqual(0);
    });

    it('should round down properly', () => {
      expect(nanosToMillis(999999)).toEqual(0);
      expect(nanosToMillis(1000001)).toEqual(1);
    });
  });

  describe('isCustomDateFormatOptions', () => {
    it('should return true for a valid date format', () => {
      expect(isCustomDateFormatOptions({ date_format: 'date format' })).toBe(
        true
      );
    });

    it('should return true for a valid but empty date format', () => {
      expect(isCustomDateFormatOptions({ date_format: '' })).toBe(true);
    });

    it('should return false for undefined date format', () => {
      expect(isCustomDateFormatOptions(undefined)).toBe(false);
    });
  });

  describe('getFormattedDate', () => {
    const mockDh = {
      i18n: {
        TimeZone: {
          getTimeZone: jest.fn(),
        },
        DateTimeFormat: {
          format: jest.fn(),
        },
      },
    };

    const workspaceSettings = {
      defaultDateTimeFormat: 'yyyy-MM-dd HH:mm:ss',
      timeZone: 'America/New_York',
    } as WorkspaceSettings;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('dh api should be used to parse and format date if isNanoseconds', () => {
      const value = '2053877400123450000';

      mockDh.i18n.TimeZone.getTimeZone.mockReturnValue({
        id: workspaceSettings.timeZone,
      });
      getFormattedDate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockDh as any,
        value,
        true,
        workspaceSettings
      );

      expect(mockDh.i18n.DateTimeFormat.format).toHaveBeenCalledWith(
        getDateTimeFormat(workspaceSettings, false),
        value,
        { id: workspaceSettings.timeZone }
      );
    });

    it('dh api should be called with a JS date object if not isNanoseconds', () => {
      mockDh.i18n.TimeZone.getTimeZone.mockReturnValue({
        id: workspaceSettings.timeZone,
      });
      getFormattedDate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockDh as any,
        '2020-01-01',
        false,
        workspaceSettings
      );

      expect(mockDh.i18n.DateTimeFormat.format).toHaveBeenCalledWith(
        getDateTimeFormat(workspaceSettings, true),
        expect.any(Date),
        { id: workspaceSettings.timeZone }
      );
    });

    it('should use timezoneOverride if provided', () => {
      const timezoneOverride = 'America/Los_Angeles';
      const formatOptions = { timezone: timezoneOverride };

      getFormattedDate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mockDh as any,
        '2053877400123450000',
        true,
        workspaceSettings,
        formatOptions
      );
      expect(mockDh.i18n.TimeZone.getTimeZone).toHaveBeenCalledWith(
        timezoneOverride
      );
    });
  });

  describe('getDateTimeFormat', () => {
    const defaultWorkspaceSettings = {
      defaultDateTimeFormat: 'yyyy-MM-dd HH:mm:ss',
      showTimeZone: false,
      showTSeparator: false,
    } as WorkspaceSettings;

    it('should return the default date time format', () => {
      expect(getDateTimeFormat(defaultWorkspaceSettings, false)).toEqual(
        defaultWorkspaceSettings.defaultDateTimeFormat
      );
    });

    it('should strip time portion is isDate', () => {
      expect(getDateTimeFormat(defaultWorkspaceSettings, true)).toEqual(
        'yyyy-MM-dd'
      );
    });

    it('should include T seperator if setting enabled', () => {
      defaultWorkspaceSettings.showTSeparator = true;
      expect(getDateTimeFormat(defaultWorkspaceSettings, false)).toEqual(
        `yyyy-MM-dd'T'HH:mm:ss`
      );
    });

    it('should include timezone if setting enabled', () => {
      defaultWorkspaceSettings.showTSeparator = false;
      defaultWorkspaceSettings.showTimeZone = true;
      expect(getDateTimeFormat(defaultWorkspaceSettings, false)).toEqual(
        `yyyy-MM-dd HH:mm:ss z`
      );
    });

    it('should include both T seperator and timezone if settings enabled', () => {
      defaultWorkspaceSettings.showTSeparator = true;
      defaultWorkspaceSettings.showTimeZone = true;
      expect(getDateTimeFormat(defaultWorkspaceSettings, false)).toEqual(
        `yyyy-MM-dd'T'HH:mm:ss z`
      );
    });
  });
});
