import React, { useState, useEffect } from "react";
import { getActiveTeams, TeamDto } from "src/apis/teams/getTeams";
import Artist, { ArtistContainer } from "src/components/atoms/Artist/Artist";
import { DetailMember } from "src/components/atoms/Artist/Artist.type";
import "./HomeTeam.css";

const HomeTeam: React.FC = () => {
  const [teams, setTeams] = useState<TeamDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      console.log('Fetching teams from API...');
      setError(null);
      const teamList = await getActiveTeams();
      console.log('Teams fetched successfully:', teamList);
      setTeams(teamList || []);
    } catch (error: any) {
      console.error('Failed to fetch teams:', error);
      console.error('Error details:', error);
      setError(error?.message || 'Failed to fetch teams');
      // Set empty array to still show the section
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const mapTeamToDetailMember = (team: TeamDto): DetailMember => ({
    id: team.id,
    name: team.name,
    description: team.description || '',
    avatar: team.avatar || '',
    position: team.position,
    linkX: team.linkX,
  });

  const handleSelectTeam = (id: string) => {
    // Handle team member selection if needed
    console.log('Selected team member:', id);
  };

  if (loading) {
    return (
      <div className="home-team-container animate-me">
        <div className="home-team">
          <div className="team-title-container">
            <svg width="21" height="26" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.21268 0.0467155C5.14111 -0.0155718 5.03374 -0.0155718 4.96217 0.0467155L1.7413 1.91534L1.59814 2.03991L0.059289 4.12654C-0.0122858 4.15768 -0.012277 4.25111 0.0235104 4.3134L4.99795 14.9023C5.06952 15.0268 5.24847 15.0268 5.32004 14.9334L11.9765 6.11974C12.0123 6.05745 12.0123 5.96402 11.9407 5.93287L5.21268 0.0467155Z"
                fill="#0A2DE9"
              ></path>
            </svg>
            <div className="team-title">OUR TEAM</div>
            <div className="team-sub-title">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-team-container animate-me">
      <div className="home-team">
        <div className="team-title-container">
          <svg width="21" height="26" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5.21268 0.0467155C5.14111 -0.0155718 5.03374 -0.0155718 4.96217 0.0467155L1.7413 1.91534L1.59814 2.03991L0.059289 4.12654C-0.0122858 4.15768 -0.012277 4.25111 0.0235104 4.3134L4.99795 14.9023C5.06952 15.0268 5.24847 15.0268 5.32004 14.9334L11.9765 6.11974C12.0123 6.05745 12.0123 5.96402 11.9407 5.93287L5.21268 0.0467155Z"
              fill="#0A2DE9"
            ></path>
          </svg>

          <div className="team-title">OUR TEAM</div>
          {error ? (
            <div className="team-sub-title">(Error loading teams)</div>
          ) : teams.length === 0 ? (
            <div className="team-sub-title">(Coming soon)</div>
          ) : (
            <div className="team-sub-title">Meet our amazing team</div>
          )}
        </div>

        {teams.length > 0 && (
          <ArtistContainer>
            {teams.map((team) => (
              <Artist 
                key={team.id} 
                detailMember={mapTeamToDetailMember(team)} 
                type="team" 
                onSelectArtist={handleSelectTeam} 
              />
            ))}
          </ArtistContainer>
        )}
      </div>
    </div>
  );
};

export default HomeTeam;
