import {
  participantsLoad,
  participantsLoaded,
  respondentsLoad,
  respondentsLoaded,
  unverifiedParticipantsLoad,
  unverifiedParticipantsLoaded,
} from '../store';
import { useApiClient, useAppSelector } from 'core/hooks';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';
import { EventSignupModelType } from '../models';
import useRemoteList from 'core/hooks/useRemoteList';

type useEventParticipantsReturn = {
  bookedParticipants: ZetkinEventParticipant[];
  cancelledParticipants: ZetkinEventParticipant[];
  numAllSignedParticipants: number;
  numAvailParticipants: number;
  numCancelledParticipants: number;
  numConfirmedParticipants: number;
  numNoshowParticipants: number;
  numRemindedParticipants: number;
  numSignedParticipants: number;
  numUnverifiedParticipants: number;
  participants: ZetkinEventParticipant[];
  pendingSignUps: ZetkinEventResponse[];
  respondents: ZetkinEventResponse[];
  unverifiedParticipants: EventSignupModelType[];
};

export default function useEventParticipants(
  orgId: number,
  eventId: number
): useEventParticipantsReturn {
  const apiClient = useApiClient();
  const participantsState = useAppSelector((state) => state.events);

  const list = participantsState.participantsByEventId[eventId];
  const respondentsList = participantsState.respondentsByEventId[eventId];

  const unverifiedParticipantsList =
    participantsState.unverifiedParticipantsByEventId[eventId];

  const participants = useRemoteList(list, {
    actionOnLoad: () => participantsLoad(eventId),
    actionOnSuccess: (participants) =>
      participantsLoaded([eventId, participants]),
    cacheKey: `event-participants-${orgId}-${eventId}`,
    loader: () =>
      apiClient.get<ZetkinEventParticipant[]>(
        `/api/orgs/${orgId}/actions/${eventId}/participants`
      ),
  });

  const unverifiedParticipants = useRemoteList(unverifiedParticipantsList, {
    actionOnLoad: () => unverifiedParticipantsLoad(eventId),
    actionOnSuccess: (unverifiedParticipants) =>
      unverifiedParticipantsLoaded([eventId, unverifiedParticipants]),
    loader: async () => {
      const data = await apiClient.get<
        Array<EventSignupModelType & { _id: string }>
      >(`/beta/orgs/${orgId}/events/${eventId}`);
      return data.map(({ _id, ...rest }) => ({
        ...rest,
        id: _id,
      }));
    },
  });

  const respondents = useRemoteList(respondentsList, {
    actionOnLoad: () => respondentsLoad(eventId),
    actionOnSuccess: (respondents) => respondentsLoaded([eventId, respondents]),
    cacheKey: `event-respondents-${orgId}-${eventId}`,
    loader: () =>
      apiClient.get<ZetkinEventResponse[]>(
        `/api/orgs/${orgId}/actions/${eventId}/responses`
      ),
  });

  const numUnverifiedParticipants = unverifiedParticipants.length;

  const numAvailParticipants = participants.filter(
    (p) => p.cancelled == null
  ).length;

  const pendingSignUps = respondents.filter(
    (r) => !participants.some((p) => p.id === r.id)
  );

  const bookedParticipants = participants.filter((p) => p.cancelled == null);

  const cancelledParticipants = participants.filter((p) => p.cancelled != null);

  const numCancelledParticipants = participants.filter(
    (p) => p.cancelled != null
  ).length;

  const numConfirmedParticipants = participants.filter(
    (p) => p.attended != null
  ).length;

  const numNoshowParticipants = participants.filter(
    (p) => p.noshow != null
  ).length;

  const numRemindedParticipants = participants.filter(
    (p) => p.reminder_sent != null && p.cancelled == null
  ).length;

  const numAllSignedParticipants =
    respondents.filter((r) => !participants.some((p) => p.id === r.id)).length +
    numUnverifiedParticipants;

  const numSignedParticipants = respondents.filter(
    (r) => !participants.some((p) => p.id === r.id)
  ).length;

  return {
    bookedParticipants,
    cancelledParticipants,
    numAllSignedParticipants,
    numAvailParticipants,
    numCancelledParticipants,
    numConfirmedParticipants,
    numNoshowParticipants,
    numRemindedParticipants,
    numSignedParticipants,
    numUnverifiedParticipants,
    participants,
    pendingSignUps,
    respondents,
    unverifiedParticipants,
  };
}
