<?php

namespace App\Entity;


use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use FOS\UserBundle\Model\User as BaseUser;

use App\Validator\Constraints as AppAssert;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use JMS\Serializer\Annotation as JMS;

/**
 * @ORM\Entity
 * @ORM\Table(name="`user`")
 *
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\HasLifecycleCallbacks()
 *
 * @JMS\ExclusionPolicy("ALL")
 */
class User extends BaseUser
{
    CONST USER_ROLES = [
        'ROLE_USER',
        'ROLE_ADMIN'
    ];

    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @JMS\Groups({"whoami", "get_project", "get_tickets"})
     * @JMS\Expose()
     */
    protected $id;

    /**
     * @ORM\Column(name="creation_date", type="datetime")
     *
     * @JMS\Groups({"whoami"})
     * @JMS\MaxDepth(0)
     * 
     * @JMS\Expose()
     */
    private $creationDate;

    /**
     * @ORM\Column(name="modification_date", type="datetime")
     *
     * @JMS\Groups({"whoami"})
     * @JMS\Expose()
     */
    private $modificationDate;

    /**
     * Plain password. Used for model validation. Must not be persisted.
     *
     * @JMS\Groups({"fillable", "whoami"})
     *
     */
    protected $plainPassword;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Project", mappedBy="users")
     * 
     * @JMS\Groups({"whoami"})
     * @JMS\Expose()
     */
    private $projects;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Ticket", mappedBy="user")
     * @JMS\Groups({"whoami"})
     * @JMS\Expose()
     */
    private $tickets;

    /**
     * @ORM\Column(type="array", nullable=true)
     * @JMS\Groups({"whoami"})
     * @JMS\Expose()
     */
    private $favorite = [];


    public function __construct() {
        parent::__construct();
        $this->projects = new ArrayCollection();
        $this->tickets = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreationDate()
    {
      return $this->creationDate;
    }

    public function getModificationDate()
    {
      return $this->modificationDate;
    }

    /**
     * Set id
     *
     * @param \int $id
     *
     * @return \Base
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    public function setCreationDate($creationDate)
    {
        $this->creationDate = $creationDate;

        return $this;
    }

    public function setModificationDate($modificationDate)
    {
        $this->modificationDate = $modificationDate;

        return $this;
    }

    /** @ORM\PrePersist */
    public function prePersist()
    {
        $this->setCreationDate(new \DateTime("now"))
             ->setModificationDate(new \DateTime("now"));
    }

    /** @ORM\PreUpdate */
    public function preUpdate()
    {
        $this->setModificationDate(new \DateTime("now"));
    }

    /**
     * @return Collection|Project[]
     */
    public function getProjects(): Collection
    {
        return $this->projects;
    }

    public function addProject(Project $project): self
    {
        if (!$this->projects->contains($project)) {
            $this->projects[] = $project;
            $project->addUser($this);
        }

        return $this;
    }

    public function removeProject(Project $project): self
    {
        if ($this->projects->contains($project)) {
            $this->projects->removeElement($project);
            $project->removeUser($this);
        }

        return $this;
    }

    /**
     * @return Collection|Ticket[]
     */
    public function getTickets(): Collection
    {
        return $this->tickets;
    }

    public function addTicket(Ticket $ticket): self
    {
        if (!$this->tickets->contains($ticket)) {
            $this->tickets[] = $ticket;
            $ticket->setUser($this);
        }

        return $this;
    }

    public function removeTicket(Ticket $ticket): self
    {
        if ($this->tickets->contains($ticket)) {
            $this->tickets->removeElement($ticket);
            // set the owning side to null (unless already changed)
            if ($ticket->getUser() === $this) {
                $ticket->setUser(null);
            }
        }

        return $this;
    }

    public function getFavorite(): ?array
    {
        return $this->favorite;
    }

    public function addFavorite(?array $favorite): self
    {
        $this->favorite[] = $favorite;

        return $this;
    }

    public function removeFavorite(?array $favorite): self
    {
        if ($this->favorite->contains($favorite)) {
            $this->favorite->removeElement($favorite);
        }
        return $this;
    }

    public function setFavorite(?array $favorite): self
    {
        $this->favorite = $favorite;

        return $this;
    }

}